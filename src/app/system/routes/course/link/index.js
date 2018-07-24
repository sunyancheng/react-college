import React from 'react'
import Base from 'common/base'
import FormModal from 'common/page/form-modal'
import api from 'common/api'
import Operation from './operation'
import TreeSelect from './tree'
import actions from 'system/actions/course-link'
import AppendixUploader from './appendix-uploader'
import Breadcrumb from 'common/breadcrumb'
import './style.less'

export default (class extends Base {
  modelFields = [
    {
      field: 'handouts',
      formItemProps: {
        label: '添加讲义'
      },
      renderItem: ({ state }) => {
        return (
          <Operation onChange={this.handleChange({ type: 1 })} options={state.handoutOptions} />
        )
      }
    }, {
      field: 'video',
      formItemProps: {
        label: '添加视频'
      },
      renderItem: ({ state }) => {
        return (
          <TreeSelect onChange={this.handleChange({ type: 2 })} options={state.videoOptions} />
        )
      }
    }, {
      field: 'exam',
      formItemProps: {
        label: '添加练习'
      },
      renderItem: ({ state }) => {
        return (
          <Operation onChange={this.handleChange({ type: 4 })} options={state.examOptions} />
        )
      }
    }, {
      field: 'experiment',
      formItemProps: {
        label: '添加实验'
      },
      renderItem: ({ state }) => {
        return (
          <Operation onChange={this.handleChange({ type: 3 })} options={state.experimentOptions} />
        )
      }
    }, {
      field: 'other',
      formItemProps: {
        label: '添加附件'
      },
      renderItem: ({ props }) => {
        return (
          <AppendixUploader
            onLoading={(loading) => props.dispatch(actions.modalLoading(loading))}
            onChange={this.handleChange({ type: 5 })}
          />)
      }
    }
  ]

  mapToOptions = (label, value) => (item) => ({ label: `${item[label]}（${item[value]}）`, value: item[value] })
  mapToVideoOptions = (label, value) => (item) => ({ label: `${item[label]}（${item[value]}）`, value: item[value], key: item[value], type: item.type, children: item.children ? item.children.map(this.mapToVideoOptions('name', 'video_id')) : null })
  initState = async () => {
    const [
      list, lectures, videos, experiments, exam] = await Promise.all(
        [
          api.systemCourseResource({ course_id: this.props.match.params.course_id }),
          api.systemLectureListAll(),
          api.systemVideoListAll(),
          api.systemExperimentListAll(),
          api.systemExerciseListAll()
        ]
      )
    const handoutOptions = lectures.list.map(this.mapToOptions('name', 'handouts_id'))
    const experimentOptions = experiments.list.map(this.mapToOptions('name', 'experiment_id'))
    const videoOptions = videos.list.map(this.mapToVideoOptions('name', 'video_id'))
    const examOptions = exam.list.map(this.mapToOptions('name', 'exam_id'))

    return {
      model: {
        handouts: list['handouts'],
        exam: list['exam'],
        experiment: list['experiment'],
        video: list['video'],
        other: list['other']
      },
      handoutOptions,
      experimentOptions,
      videoOptions,
      examOptions,
      course_id: this.props.match.params.course_id
    }
  }

  handleChange = ({ type }) => (value) => {
    const course_id = this.props.match.params.course_id
    const resource_ids = type !== 5 ? value.join(',') : value.fname
    api.bindResource({ type, course_id, resource_ids: resource_ids || '' })
  }

  // handleSave = () => this.goBack()

  goBack = () => this.props.history.push('/course')

  render() {
    return (
      <FormModal
        isPage
        title={<Breadcrumb />}
        onCancel={this.goBack}
        initState={this.initState}
        modelFields={this.modelFields}
      />
    )
  }
}).connect(() => ({})).withRouter()
