import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import { EXAM_STATUS, EXAM_TYPE, EXAM_DIFFICULTY, EXAM_ANSWER } from 'common/config'
import actions from 'system/actions/exam'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import { BtnGroup, Btn } from 'common/button-group'
import Status from 'common/page/page-table-status'
import { FormModalStatic, FormModalCombine } from 'common/page/form-modal'
import { Select2 } from 'common/select'
import { IconButton } from 'common/button'
import { Input } from 'antd'
import Tooltip from 'common/tooltip'
import api from 'common/api'
const { TextArea } = Input
import './style.less'
import ExamContent from './exam-content'
import PictureWall from 'common/pic-wall'
import ConfirmModal from 'common/page/confirm-modal'
import FileInput from './file-input'
import Alert from 'common/alert'

const choiceLabel = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G'
]

export default (class extends Base {
  columns = [
    {
      title: '试题ID',
      dataIndex: 'exam_pool_id'
    }, {
      title: '课程名称',
      dataIndex: 'course_name',
      render({ course_name }) {
        return <Tooltip title={course_name} />
      }
    }, {
      title: '试题类型',
      dataIndex: 'type',
      render(data) {
        return <Status config={EXAM_TYPE} value={data.type} />
      }
    }, {
      title: '试题题干',
      dataIndex: 'title',
      render({ title }) {
        return <Tooltip title={title} />
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      render(data) {
        return <Status config={EXAM_STATUS} value={data.status} />
      }
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('info', data)) }} >查看</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }}>修改</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('delete', data)) }}>删除</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  checkModelFields = [
    {
      render({ state }) {
        const { model } = state
        return (
          <div className="check_id">
            <span>试题ID：<span className="content">{model.exam_pool_id}</span></span>
          </div>
        )
      }
    }, {
      field: 'set_question_people',
      formItemProps: {
        label: '出题人'
      },
      renderItem: 'static'
    }, {
      field: 'ctime',
      formItemProps: {
        label: '上传时间'
      },
      renderItem: 'static'
    }, {
      field: 'type',
      formItemProps: {
        label: '试题类型'
      },
      renderItem() {
        return <Status config={EXAM_TYPE} />
      }
    }, {
      field: 'difficulty',
      formItemProps: {
        label: '难度'
      },
      renderItem: 'static'
    }, {
      field: 'course_name',
      formItemProps: {
        label: '课程名称'
      },
      renderItem: 'static'
    }, {
      field: 'knowledge_point',
      formItemProps: {
        label: '知识点'
      },
      renderItem: 'static'
    }, {
      field: 'title',
      formItemProps: {
        label: '题干'
      },
      renderItem: 'static'
    }, {
      field: 'img_urls',
      formItemProps: {
        label: '图片'
      },
      renderItem({ state }) {
        const img_urls = state.model.img_urls
        return (<div className="exam-pool__img-wrapper" >
          {img_urls && img_urls.length > 0
            ? img_urls.map((url, i) => <div key={i} className="exam-pool__img-boarder"><div style={{ backgroundImage: 'url("' + url + '")' }} /></div>)
            : <div>无</div>
          }
        </div>)
      }
    }, {
      field: 'analysis',
      formItemProps: {
        label: '试题解析'
      },
      renderItem: 'static'
    }, {
      field: 'status',
      formItemProps: {
        label: '试题状态'
      },
      renderItem() {
        return <Status config={EXAM_STATUS.map(({ value, label }) => ({ value, label }))} />
      }
    }, {
      render({ state }) {
        const type = state.model.type
        if (type == 1 || type == 2) {
          const choices_abcd = state.model.choices_abcd
          return (
            choices_abcd && (
              <div className="exam-pool__answer">
                {choices_abcd.map((choice, i) => <div key={i}>{choiceLabel[i]}: {choice}</div>)}
              </div>
            )
          )
        }
        return null
      }
    }, {
      field: 'chioces_abcd',
      formItemProps: {
        label: '实验ID'
      },
      condition({ model }) {
        return model.type == 4
      },
      renderItem({ state }) {
        return <span>{state.model.choices_abcd[0]}</span>
      }
    }, {
      field: 'answer',
      formItemProps: {
        label: '答案'
      },
      renderItem({ state }) {
        let answer = state.model.answer
        if (state.model.type == 3) {
          answer = answer === 'T' ? '正确' : '错误'
        }
        return <span>{answer}</span>
      }
    }
  ]

  answerFields = (...types) => ({
    condition: ({ props, model }) => types.includes(props.form.getFieldValue('type') || ('' + model.type)),
    field: 'answer',
    formItemProps: {
      label: '答案',
      rules: [
        { required: true, message: '答案不能为空' }
      ]
    }
  })

  choicesFields = (label, ...types) => ({
    condition: ({ props, model }) => types.includes(props.form.getFieldValue('type') || ('' + model.type)),
    field: 'choices_abcd',
    formItemProps: {
      label
    },
  })

  modelFields = (isEdit) => [
    {
      field: 'set_question_people',
      formItemProps: {
        label: '出题人'
      },
      fieldDecorator: isEdit ? {
        rules: [{ required: true, message: '出题人不能为空' },],
      } : {
          rules: [{ required: true, message: '出题人不能为空' },],
          initialValue: '360网络安全学院'
        }
    }, {
      field: 'difficulty',
      hasPopupContainer: true,
      formItemProps: {
        label: '难度'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '难度不能为空' },
        ],
      },
      renderItem() {
        return (<Select2 placeholder="难度" options={EXAM_DIFFICULTY} getValue={i => i.value} getLabel={i => i.label} />)
      }
    }, {
      field: 'course_name',
      formItemProps: {
        label: '课程名称'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '课程名称不能为空' },
        ],
      }
    }, {
      field: 'knowledge_point',
      formItemProps: {
        label: '知识点'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '知识点不能为空' },
        ],
      }
    }, {
      field: 'title',
      formItemProps: {
        label: '题干'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '题干不能为空' },
        ],
      },
      renderItem() {
        return (<TextArea placeholder="题干" />)
      }
    }, {
      field: 'imgs',
      formItemProps: {
        label: '图片'
      },
      renderItem() {
        return <PictureWall />
      }
    }, {
      field: 'analysis',
      formItemProps: {
        label: '试题解析'
      },
      renderItem() {
        return (<TextArea placeholder="试题解析" />)
      }
    },
    // {
    //   field: 'status',
    //   formItemProps: {
    //     label: '试题状态'
    //   },
    //   fieldDecorator: {
    //     rules: [
    //       { required: true, message: '试题状态不能为空' },
    //     ],
    //     validateTrigger: 'onChange'
    //   },
    //   renderItem() {
    //     return (<RadioGroup2 options={EXAM_STATUS} getValue={i => i.value} getLabel={i => i.label} />)
    //   }
    // },
    {
      field: 'type',
      hasPopupContainer: true,
      formItemProps: {
        label: '试题类型',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '试题类型不能为空' },
        ],
      },
      renderItem({ props }) {
        const onChange = () => {
          props.form.setFieldsValue({
            answer: undefined,
            choices_abcd: undefined
          })
        }
        return (<Select2 onChange={(type) => onChange(type)} placeholder="单选题" options={EXAM_TYPE} getValue={i => i.value} getLabel={i => i.label} />)
      }
    },
    {
      ...this.choicesFields('', '1', '2'),
      renderItem() {
        return <ExamContent />
      }
    }, {
      ...this.choicesFields('实验ID', '4'),
      hasPopupContainer: true,
      renderItem({ state }) {
        return <Select2 optionLabelProp={'value'} options={state.experimentOptions} getValue={i => i.value} getLabel={i => `（${i.value}）${i.label}`} />
      }
    }, {
      ...this.answerFields('1'),
      hasPopupContainer: true,
      renderItem({ props }) {
        const answerOptions = choiceLabel.slice(0, (props.form.getFieldValue('choices_abcd') || []).length)
        return <Select2 options={answerOptions} getValue={i => i} getLabel={i => i} />
      }
    }, {
      ...this.answerFields('2'),
      hasPopupContainer: true,
      renderItem({ props }) {
        const answerOptions = choiceLabel.slice(0, (props.form.getFieldValue('choices_abcd') || []).length)
        return <Select2 mode={'multiple'} options={answerOptions} getValue={i => i} getLabel={i => i} />
      }
    }, {
      ...this.answerFields('3'),
      hasPopupContainer: true,
      renderItem() {
        return <Select2 options={EXAM_ANSWER} getValue={i => i.value} getLabel={i => i.label} />
      }
    }, {
      ...this.answerFields('4', '5'),
      renderItem() {
        return <TextArea placeholder="试题答案" />
      }
    }
  ]


  filters = [
    { label: '试题编号', name: 'exam_pool_id', render: renderInput },
    { label: '课程名称', name: 'course_name', render: renderInput },
    { label: '题干内容', name: 'title', render: renderInput },
    { label: '上传日期', name: 'range', render: renderRangePicker },
    { label: '试题类型', name: 'type', options: EXAM_TYPE, render: renderSelect }
  ]

  buttons = [
    <IconButton key="upload" size="small" icon="add" onClick={() => { this.dispatch(actions.showModal('upload')) }}>上传</IconButton>,
    <IconButton key="new" size="small" icon="add" onClick={() => { this.dispatch(actions.showModal('add')) }}>创建</IconButton>,
  ]

  editState = async ({ modalParams }) => {
    var { answer, type } = modalParams
    modalParams.img_urls = modalParams.img_urls ? modalParams.img_urls : []
    modalParams.imgs = modalParams.img_urls

    if (type == '2') {
      answer = answer.split('')
    }
    const experimentOptions = await api.systemExperimentGetAllAvaliable()
    return {
      model: { ...modalParams, answer },
      experimentOptions: Object.keys(experimentOptions).map(v => ({ value: v, label: experimentOptions[v] }))
    }

  }

  checkState = ({ modalParams }) => {
    modalParams.choices_abcd = modalParams.choices_abcd ? modalParams.choices_abcd : []
    modalParams.img_urls = modalParams.img_urls ? modalParams.img_urls : []
    modalParams.imgs = modalParams.img_urls
    return {
      model: modalParams
    }
  }

  newState = async () => {
    const experimentOptions = await api.systemExperimentGetAllAvaliable()
    return {
      model: { img: [] },
      experimentOptions: Object.keys(experimentOptions).map(v => ({ value: v, label: experimentOptions[v] }))
    }
  }

  handleEdit = (values, exam_pool_id) => {
    this.dispatch(
      actions.edit({
        ...values,
        choices_json: values.type != 4 ? JSON.stringify(values.choices_abcd) : JSON.stringify([].concat(values.choices_abcd)),
        imgs: JSON.stringify(values.imgs),
        answer: values.type == 2 ? values.answer.join('') : values.answer, //多选join
        status: 1,
        exam_pool_id
      }))
  }

  handleCreate = (values) => {
    this.dispatch(
      actions.add({
        ...values,
        choices_json: values.type != 4 ? JSON.stringify(values.choices_abcd) : JSON.stringify([].concat(values.choices_abcd)),
        imgs: JSON.stringify(values.imgs),
        status: 1,
        answer: values.type == 2 ? values.answer.join('') : values.answer, //多选join
      })
    )
  }

  render() {
    const { uploadCSVError } = this.props
    return (
      <Page
        title="试题列表"
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        buttons={this.buttons}
        selectId={i => i.exam_pool_id}
        exportUrl="/core/resource/admin/exam-pool/export"
      >
        <FormModalStatic
          title="查看试题"
          name="info"
          onCancel={() => this.dispatch(actions.hideModal('info'))}
          modelFields={this.checkModelFields}
          initState={this.checkState}
        />
        <FormModalCombine
          title="修改试题"
          name="edit"
          modelFields={[{
            field: 'exam_pool_id',
            formItemProps: {
              label: '试题ID'
            },
            renderItem: 'static'
          }, ...this.modelFields(true)]}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={(values, { exam_pool_id }) => this.handleEdit(values, exam_pool_id)}
          initState={this.editState}
        />
        <FormModalCombine
          title="创建试题"
          name="add"
          modelFields={this.modelFields(false)}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={(values) => this.handleCreate(values)}
          initState={this.newState}
        />
        <FormModalCombine
          title="试题上传"
          name="upload"
          modelFields={[
            {
              field: 'file',
              formItemProps: {
                label: '选择文件',
                validateStatus: (uploadCSVError ? 'error' : ''),
                help: uploadCSVError && (
                  <div>
                    {uploadCSVError.split(';').map((msg, i) =>
                      <div key={i}>{msg}</div>
                    )}
                  </div>
                )
              },
              renderItem() {
                return <FileInput accept=".csv" />
              }
            }
          ]}
          onCancel={() => this.dispatch(actions.hideModal('upload'), actions.setPageState({ uploadCSVError: undefined }))}
          onSave={(values) => api.systemExamAddFile(values)
            .then(() => {
              Alert.info('添加成功')
              this.dispatch(actions.hideModal('upload'), actions.getPage(), actions.setPageState({ uploadCSVError: undefined }))
            })
            .catch((e) => this.dispatch(actions.setPageState({ uploadCSVError: e.errmsg })))
          }
        />
        <ConfirmModal
          title="操作提示"
          name="delete"
          message={"删除后，试题将不可恢复，请确认操作！"}
          onCancel={() => this.dispatch(actions.hideModal('delete'))}
          onSave={({ exam_pool_id }) => this.dispatch(actions.delete({ exam_pool_id }))}
        />
      </Page>
    )
  }
}).connect((state) => {
  const visible = state.page.modalVisible
  const uploadCSVError = state.page.uploadCSVError
  return {
    visible,
    uploadCSVError
  }
})
