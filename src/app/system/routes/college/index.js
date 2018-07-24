import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-breadcrumb'
import { COLLEGE_CONFIG_STATUS } from 'common/config'
import actions from 'system/actions/course-college'
import { BtnGroup, Btn } from 'common/button-group'
import Status from 'common/page/page-table-status'
import FormModal from 'common/page/form-modal'
import { IconButton } from 'common/button'
import { DatePicker } from 'antd'
import Portrait from 'common/portrait'
import { cachedApi } from 'common/api'

const FIELDS = ['regdate']

function defaultModalField(labelCol, wrapperCol) {
  return {
    labelCol: { span: labelCol },
    wrapperCol: { span: wrapperCol }
  }
}

export default (class extends Base {
  columns = [
    {
      title: '学院ID',
      dataIndex: 'college_id'
    }, {
      title: '学院名称',
      dataIndex: 'name'
    }, {
      title: '专业类目',
      dataIndex: 'direction'
    }, {
      title: '学院状态',
      dataIndex: 'status',
      render(data) {
        return <Status config={COLLEGE_CONFIG_STATUS} value={data.status} />
      }
    }, {
      title: '成立日期',
      dataIndex: 'regdate'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }}>修改</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  modelFields = [
    {
      render({ props, state }) {
        return props.form.getFieldDecorator('logo', {
          initialValue: state.model ? state.model.logo : ''
        })(
          <Portrait help style={{ position: 'absolute', top: 0, right: 20 }} accept=".jpg,.png,.bmp,.jpeg" />
        )
      }
    }, {
      field: 'name',
      formItemProps: {
        label: '学院名称',
        ...defaultModalField(4, 8)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '专业名称不能为空' },
        ],
      },
    }, {
      field: 'direction',
      formItemProps: {
        label: '专业类目',
        ...defaultModalField(4, 8)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '专业编码不能为空' },
        ],
      },
    }, {
      field: 'regdate',
      formItemProps: {
        label: '成立日期',
        ...defaultModalField(4, 8)
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '启动日期不能为空' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return <DatePicker format="YYYY-MM-DD" />
      }
    }, {
      field: 'copyright',
      formItemProps: {
        label: '版权信息',
        ...defaultModalField(4, 8)
      },
    }
  ]

  buttons = <IconButton size="small" icon="add" onClick={() => { this.dispatch(actions.showModal('add')) }}>新建</IconButton>

  initState = ({ modalParams }, momentize) => {
    return {
      model: momentize(modalParams, FIELDS)
    }
  }

  render() {
    return (
      <Page
        title="学院配置"
        actions={actions}
        columns={this.columns}
        buttons={this.buttons}
        selectId={i => i.college_id}
      >
        <FormModal
          title="修改学院"
          name="edit"
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={(modalParams, { college_id }) => {
            cachedApi.systemCourseGetCourseOpts.clear()
            this.dispatch(actions.edit({ ...modalParams, college_id, status: 1 }))
          }}
          initState={this.initState}
        />
        <FormModal
          title="添加学院"
          name="add"
          modelFields={this.modelFields.filter(fields => fields.field !== 'status')}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={(modalParams) => {
            cachedApi.systemCourseGetCourseOpts.clear()
            this.dispatch(actions.add(modalParams))
          }}
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
