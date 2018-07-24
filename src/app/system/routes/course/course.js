import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import api from 'common/api'
import actions from 'system/actions/course-config'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import Status from 'common/page/page-table-status'
import { FormModalStatic, FormModalCombine } from 'common/page/form-modal'
import { Select2 } from 'common/select'
import { COURSE_CONFIG_STATUS, COURSE_PULICITY } from 'common/config'
import { BtnGroup, Btn } from 'common/button-group'
import { IconButton } from 'common/button'
import Portrait from 'common/portrait'
import { Input } from 'antd'
const { TextArea } = Input
import cashValidator from 'common/cash-validator'


function defaultModalField(labelCol, wrapperCol) {
  return {
    labelCol: { span: labelCol },
    wrapperCol: { span: wrapperCol }
  }
}


export default (class extends Base {
  columns = [
    {
      title: '课程ID',
      dataIndex: 'course_id',
    }, {
      title: '专业类目',
      dataIndex: 'college_direction'
    }, {
      title: '课程名称',
      dataIndex: 'name'
    }, {
      title: '课程讲师',
      dataIndex: 'description',
      render: ({ teachers }) => {
        return <span>{teachers.map(teacher => teacher.name).join('；')}</span>
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      render(item) {
        return <Status config={COURSE_CONFIG_STATUS} value={item.status} />
      }
    }, {
      title: '权限',
      dataIndex: 'is_public',
      render(item) {
        return <Status config={COURSE_PULICITY} value={item.is_public} />
      }
    }, {
      title: '上架日期',
      dataIndex: 'up_date'
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 250,
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('info', data)) }} >查看</Btn>
            <Btn onClick={() => { this.props.history.push(`course/link/${data.course_id}`) }}>关联课件</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }}>修改</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('review', data)) }}>审核</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  filters = [
    { label: '课程ID', name: 'course_id', render: renderInput },
    { label: '课程名称', name: 'name', render: renderInput },
    { label: '状态', name: 'status', options: COURSE_CONFIG_STATUS, placeholder: '课程状态', render: renderSelect },
    { label: '权限', name: 'is_public', options: COURSE_PULICITY, placeholder: '课程权限', render: renderSelect },
    { label: '上架日期', name: 'ctime', render: renderRangePicker },
  ]

  modelFields = [
    {
      render({ props, state }) {
        return props.form.getFieldDecorator('pic', {
          initialValue: state.model.pic,
          // rules: [
          //   { required: true, message: '课程封面不能为空' },
          // ],
        })(
          <Portrait accept=".jpg,.png,,.jpeg" help style={{ position: 'absolute', top: 0, right: 20 }} />
        )
      }
    }, {
      field: 'college_id',
      formItemProps: {
        label: '专业类目',
        ...defaultModalField(4, 8)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '专业类目不能为空' },
        ],
      },
      renderItem({ state }) {
        return <Select2 showSearch options={state.course_opts} getValue={i => i.college_id} getLabel={i => i.direction} />
      }
    },
    {
      field: 'name',
      formItemProps: {
        label: '课程名称',
        ...defaultModalField(4, 8)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '课程名称不能为空' },
        ],
      },
    },
    {
      field: 'level',
      formItemProps: {
        label: '课程难度',
        ...defaultModalField(4, 8)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '课程难度不能为空' },
        ],
      },
      renderItem({ state }) {
        return <Select2 showSearch options={state.level} getValue={i => i.value} getLabel={i => i.label} />
      }
    },
    {
      field: 'suitable',
      formItemProps: {
        label: '适合人群',
        ...defaultModalField(4, 8)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '适合人群不能为空' },
        ],
      }
    },
    {
      field: 'description',
      formItemProps: {
        label: '课程介绍',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '课程介绍不能为空' },
        ],
      },
      renderItem() {
        return (
          <TextArea />
        )
      }
    }, {
      field: 'tags',
      formItemProps: {
        label: '课程标签'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '课程标签不能为空' },
        ],
      }
    }, {
      field: 'teacher_ids',
      hasPopupContainer: true,
      formItemProps: {
        label: '课程讲师'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '课程讲师不能为空' },
        ],
      },
      renderItem({ state }) {
        return (<Select2 mode="multiple" placeholder="请选择" options={state.teacher_list} getValue={i => i.teacher_id} getLabel={i => i.name} />)
      }
    }, {
      field: 'price',
      formItemProps: {
        label: '课程价格'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '课程价格不能为空' },
          // { pattern: /^([1-9]+(\.\d+)?|0\.\d+)$/, message: '课程价格格式不正确' }
          { validator: cashValidator }
        ],
      }
    }, {
      field: 'valid_day',
      formItemProps: {
        label: '课程有效期/天',
        ...defaultModalField(6, 17)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '课程有效期不能为空' },
          { pattern: /^(?!0+$)\d{0,3}$/, message: '有效期格式应为1-999' }
        ],
      }
    }, {
      field: 'rec_day',
      formItemProps: {
        label: '推荐时间/天',
        ...defaultModalField(6, 17)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '推荐时间不能为空' },
          { pattern: /^(?!0+$)\d{0,3}$/, message: '学习推荐时间应为1-999天' }
        ],
      }
    }, {
      field: 'is_public',
      formItemProps: {
        label: '课程权限'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '课程权限不能为空' }
        ],
      },
      renderItem({ state }) {
        return <Select2 showSearch options={state.public} getValue={i => i.value} getLabel={i => i.label} />
      }
    }, {
      field: 'text',
      formItemProps: {
        label: '注意'
      },
      renderItem() {
        return <span>一期公开课只支持纯视频课程</span>
      }
    }
  ]

  checkModelFields = [
    {
      field: 'course_id',
      formItemProps: {
        label: '课程ID'
      },
      renderItem: 'static'
    },
    {
      field: 'college_direction',
      formItemProps: {
        label: '专业方向'
      },
      renderItem: 'static'
    },
    {
      field: 'teachers',
      formItemProps: {
        label: '课程讲师'
      },
      renderItem({ state }) {
        const { model } = state
        return (
          <span>{model.teachers.map(teacher => teacher.name).join('；')}</span>
        )
      }
    }, {
      field: 'status',
      formItemProps: {
        label: '状态'
      },
      renderItem() {
        return (
          <Status config={COURSE_CONFIG_STATUS.map(({ label, value }) => ({ label, value }))} />
        )
      }
    }, {
      field: 'up_date',
      formItemProps: {
        label: '上架日期'
      },
      renderItem: 'static'
    }
  ]

  initState = async ({ name, modalParams }) => {
    var newModal = {}
    if (name === 'edit' || 'add') {
      var [course_opts, { list: teacher_list } = teacher_list] = await Promise.all([
        api.systemCourseGetCourseOpts(),
        api.systemTeacherSimpleList()
      ])
    }
    if (name === 'info') {
      newModal = await api.systemCourseDetail({ course_id: modalParams.course_id })
    }
    const model = { ...modalParams, ...newModal, teacher_ids: modalParams ? modalParams.teacher_ids.split(',').filter(v => !!v) : undefined }
    return {
      model,
      course_opts,
      teacher_list,
      level: [
        { value: '1', label: '初级' },
        { value: '2', label: '中级' },
        { value: '3', label: '高级' }
      ],
      public: COURSE_PULICITY,
      review: [
        { value: '1', label: '上架' },
        { value: '2', label: '下架' }
      ]
    }
  }

  reviewState = ({ modalParams }) => {
    if (modalParams.status === '3') {
      delete modalParams.status
    }
    const options = [{ value: '1', label: '上架' }, { value: '2', label: '下架' }]
    return {
      model: modalParams,
      options
    }
  }

  reviewModelFields = [
    {
      field: 'course_id',
      formItemProps: {
        label: '课程ID'
      },
      renderItem({ state }) {
        const { model } = state
        return (
          <span>{model.course_id}</span>
        )
      }
    }, {
      field: 'name',
      formItemProps: {
        label: '课程名称'
      },
      renderItem({ state }) {
        const { model } = state
        return (
          <span>{model.name}</span>
        )
      }
    },
    //  {
    //   field: 'review',
    //   formItemProps: {
    //     label: '审核链接'
    //   },
    //   renderItem() {
    //     // const { model } = state
    //     return (
    //       <span />
    //     )
    //   }
    // },
    {
      field: 'opinion',
      formItemProps: {
        label: '审核意见',
        ...defaultModalField(4, 20)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '审核意见不能为空' }
        ],
      },
      renderItem() {
        return (
          <TextArea />
        )
      }
    }, {
      field: 'status',
      formItemProps: {
        label: '审核结果',
        ...defaultModalField(4, 20)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '审核结果不能为空' }
        ],
      },
      renderItem({ state }) {
        return <Select2 options={state.options} getValue={i => i.value} getLabel={i => i.label} />
      }
    }
  ]

  editModelFields = (baseModelFields) => {
    const temp = baseModelFields.slice()
    var portrait = temp.shift()
    temp.unshift(portrait, {
      field: 'course_id',
      formItemProps: {
        label: '课程ID',
        ...defaultModalField(4, 8)
      },
      renderItem({ state }) {
        return <span>{state.model && state.model.course_id}</span>
      }
    })

    return temp
  }

  buttons = <IconButton size="small" icon="add" onClick={() => { this.dispatch(actions.showModal('add')) }}>新建</IconButton>


  render() {
    return (
      <Page
        title="课程配置"
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        buttons={this.buttons}
        selectId={i => i.course_id}
        exportUrl="/core/course/admin/course/export"
      >
        <FormModalStatic
          title="课程信息"
          name="info"
          initState={this.initState}
          modelFields={this.checkModelFields}
          onCancel={() => this.dispatch(actions.hideModal('info'))}
        />
        <FormModalCombine
          title="修改课程"
          name="edit"
          width={400}
          modelFields={this.editModelFields(this.modelFields)}
          initState={this.initState}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={(criteria, { course_id }) => this.dispatch(actions.edit({ ...criteria, course_id, teacher_ids: criteria.teacher_ids.join(',') }))}
        />
        <FormModalCombine
          title="新建课程"
          name="add"
          modelFields={this.modelFields}
          initState={this.initState}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={(criteria) => this.dispatch(actions.add({ ...criteria, teacher_ids: criteria.teacher_ids.join(',') }))}
        />
        <FormModalCombine
          title="课程审核"
          name="review"
          modelFields={this.reviewModelFields}
          initState={this.reviewState}
          onCancel={() => this.dispatch(actions.hideModal('review'))}
          onSave={(criteria, { course_id }) => this.dispatch(actions.postCourseAudit({ ...criteria, course_id }))}
        />
      </Page>

    )
  }
}).connect(() => ({}))
