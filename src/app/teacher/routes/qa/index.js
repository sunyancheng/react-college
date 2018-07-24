import React from 'react'
import Base from 'common/base'
import PageTable from 'user/components/page-table'
import actions from 'teacher/actions/qa'
import { ANSWER_STATUS, YES_OR_NO } from 'common/config'
import { FormModalCombine, FormModalStatic } from 'common/page/form-modal'
import { BtnGroup, Btn } from 'common/button-group'
import PagePagination from 'common/page/page-pagination'
import api from 'common/api'
import { Input } from 'antd'
import { RadioGroup2 } from 'common/radio-group'
import Status from 'common/page/page-table-status'
import TeacherPage from 'teacher/components/teacher-page'
import Tooltip from 'common/tooltip'
export default (class extends Base {

  componentWillMount() {
    this.dispatch(actions.initPage({}))
    this.dispatch(actions.getPage())
  }

  componentWillUnmount() {
    this.dispatch(actions.clearPage())
  }

  models = [
    ['qa_id', '问题ID'],
    ['campus', '中心名称'],
    ['class', '学员班级'],
    ['student', '提问学员'],
    ['ctime', '提问时间'],
    ['course', '提问课程'],
    ['question', '问题'],
    ['answer', '解答'],
    ['teacher', '解答人'],
    ['utime', '答疑时间'],
    ['recommend', '是否已推荐', function ({ state }) {
      let { recommend } = (state.model || {});
      return <span>{recommend == 1 ? '是' : '否'}</span>
    }],
  ]

  checkModelFields = this.models.map(([field, label, render]) => ({
    field,
    formItemProps: {
      label
    },
    renderItem: render ? render : 'static'
  }))

  answerModelFields = this.models.slice(0, 7).map(([field, label, render]) => ({
    field,
    formItemProps: {
      label
    },
    renderItem: render ? render : 'static'
  })).concat([
    {
      field: 'answer',
      formItemProps: {
        label: '回复'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '回复不能为空' }
        ]
      },
      renderItem() {
        return <Input.TextArea />
      }
    }, {
      field: 'is_rec',
      formItemProps: {
        label: '是否推荐'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '是否推荐不能为空' }
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return <RadioGroup2 options={YES_OR_NO} getValue={({ value }) => value} getLabel={({ label }) => label} />
      }
    },])

  columns = [
    {
      title: '问题编号',
      dataIndex: 'qa_id'
    }, {
      title: '班级名称',
      dataIndex: 'class',
      render(item) {
        return <Tooltip title={item.class} />
      }
    }, {
      title: '提问课程',
      dataIndex: 'course',
      render({ course }) {
        return <Tooltip title={course} />
      }
    }, {
      title: '提问学员',
      dataIndex: 'user'
    }, {
      title: '问题',
      dataIndex: 'question',
      render({ question }) {
        return <Tooltip title={question} />
      }
    }, {
      title: '问题状态',
      dataIndex: 'status',
      render(item) {
        return <Status config={ANSWER_STATUS} value={item.status} />
      }
    }, {
      title: '提问日期',
      dataIndex: 'ctime'
    },
    {
      title: '操作',
      render: (data) => {
        return (
          <div>
            <BtnGroup>
              {data.status === '1' && <Btn onClick={() => { this.dispatch(actions.showModal('check', data)) }} >查看</Btn>}
              {data.status === '2' && <Btn type="caution" onClick={() => { this.dispatch(actions.showModal('answer', data)) }} >答疑</Btn>}
            </BtnGroup>
          </div>
        );
      }
    },
  ]

  initState({ modalParams }) {
    return new Promise((resolve) => resolve(api.teacherQADetail({ qa_id: modalParams.qa_id }))).then(model => ({ model }))
  }

  changePagination = (...args) => this.dispatch(actions.changePagination(...args))

  render() {
    const { isInit, level } = this.props
    if (!isInit) return null
    return (
      <TeacherPage
        fill
        level={level}
        title="学员答疑"
      >
        <PageTable
          actions={actions}
          columns={this.columns}
          selectId={(i, index) => i.qa_id + index}
        />
        <PagePagination onChange={this.changePagination} />
        <FormModalStatic
          title="查看"
          name="check"
          modelFields={this.checkModelFields}
          onCancel={() => this.dispatch(actions.hideModal('check'))}
          initState={this.initState}
        />
        <FormModalCombine
          title="答疑"
          name="answer"
          modelFields={this.answerModelFields}
          onCancel={() => this.dispatch(actions.hideModal('answer'))}
          onSave={(criteria) => this.dispatch(actions.answerQA(criteria))}
          initState={this.initState}
        />
      </TeacherPage>
    )
  }
}).connect(state => {
  const { isInit } = state.page
  const { teacherInfo } = state.app
  return {
    isInit,
    level: teacherInfo.level || '1'
  }
})


