import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-breadcrumb'
import { MAJOR_CONFIG_STATUS } from 'common/config'
import actions from 'system/actions/course-major'
import { cachedApi } from 'common/api'
import { BtnGroup, Btn } from 'common/button-group'
import Status from 'common/page/page-table-status'
import FormModal from 'common/page/form-modal'
import { Select2 } from 'common/select'
import { IconButton } from 'common/button'
import { Input } from 'antd'
const { TextArea } = Input
import Portrait from 'common/portrait'

function defaultModalField(labelCol, wrapperCol) {
  return {
    labelCol: { span: labelCol },
    wrapperCol: { span: wrapperCol },
  }
}

export default (class extends Base {
  columns = [
    {
      title: '专业ID',
      dataIndex: 'major_id'
    }, {
      title: '专业类目',
      dataIndex: 'college_direction'
    }, {
      title: '专业名称',
      dataIndex: 'name'
    }, {
      title: '专业编码',
      dataIndex: 'abbr'
    }, {
      title: '状态',
      dataIndex: 'status',
      render(data) {
        return <Status config={MAJOR_CONFIG_STATUS} value={data.status} />
      }
    }, {
      title: '上架时间',
      dataIndex: 'ctime'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.props.history.push(`${this.props.location.pathname}/module/${data.major_id}`) }}>模块配置</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }}>修改</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  modelFields = [
    {
      render({ props, state }) {
        return props.form.getFieldDecorator('pic', {
          initialValue: state.model.pic
        })(
          <Portrait accept=".jpg,.png,.bmp,.jpeg" help style={{ position: 'absolute', top: 0, right: 20 }} />
        )
      }
    },
    {
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
        return <Select2 showSearch options={state.model.course_opts} getValue={i => i.college_id} getLabel={i => i.direction} />
      }
    },
    {
      field: 'name',
      formItemProps: {
        label: '专业名称',
        ...defaultModalField(4, 8)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '专业名称不能为空' },
        ],
      },
    },
    {
      field: 'abbr',
      formItemProps: {
        label: '专业编码',
        ...defaultModalField(4, 8)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '专业编码不能为空' },
        ],
      },
    },
    {
      field: 'feature',
      formItemProps: {
        label: '专业特色',
        ...defaultModalField(4, 8)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '专业特色不能为空' },
        ],
      },
    },
    {
      field: 'description',
      formItemProps: {
        label: '专业描述',

      },
      fieldDecorator: {
        rules: [
          { required: true, message: '专业描述不能为空' },
          { max: 200, message: '专业描述应在200字以内' }
        ],
      },
      renderItem() {
        return (
          <TextArea />
        )
      }
    },
    {
      field: 'price',
      formItemProps: {
        label: '价格',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '价格不能为空' },
        ],
      },
    },
    {
      field: 'valid_day',
      formItemProps: {
        label: '有效期(天)',
        ...defaultModalField(5, 18)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '有效期不能为空' },
        ],
      },
    },
    {
      field: 'audit_mail',
      formItemProps: {
        label: '审核人邮箱',
        ...defaultModalField(5, 18)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '审核人邮箱不能为空' },
          { type: 'email', message: '邮件格式不正确' }
        ],
      }
    }
  ]

  buttons = <IconButton size="small" icon="add" onClick={() => { this.dispatch(actions.showModal('add')) }}>新建</IconButton>

  initState = async ({ modalParams }) => {
    const course_opts = await cachedApi.systemCourseGetCourseOpts()
    return {
      model: { ...modalParams, course_opts },
    }
  }

  render() {
    return (
      <Page
        actions={actions}
        columns={this.columns}
        buttons={this.buttons}
        selectId={i => i.major_id}
      >
        <FormModal
          title="修改专业"
          name="edit"
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={(modalParams, { major_id }) => this.dispatch(actions.edit({ ...modalParams, major_id, status: 1 }))}
          initState={this.initState}
        />
        <FormModal
          title="新建专业"
          name="add"
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={(modalParams) => this.dispatch(actions.add({ ...modalParams, status: 1 }))}
          initState={this.initState}
        />
      </Page>
    )
  }
}).connect((state) => {
  const visible = state.page.modalVisible
  return {
    visible
  }
})
