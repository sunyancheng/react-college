import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-breadcrumb'
import actions from 'system/actions/course-module'
import { IconButton } from 'common/button'
import FormModal from 'common/page/form-modal'
import ConfirmModal from 'common/page/confirm-modal'
import { BtnGroup, Btn } from 'common/button-group'
import { Input } from 'antd'
import { MODULE_STATUS } from 'common/config'
import Status from 'common/page/page-table-status'

export default (class extends Base {
  columns = [
    {
      title: '序号',
      dataIndex: 'sort'
    }, {
      title: '模块ID',
      dataIndex: 'module_id'
    }, {
      title: '模块名称',
      dataIndex: 'name'
    }, {
      title: '状态',
      dataIndex: 'status',
      render(data) {
        return <Status config={MODULE_STATUS} value={data.status} />
      }
    }, {
      title: '创建时间',
      dataIndex: 'ctime'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.props.history.push(`${this.props.location.pathname}/course/${data.module_id}`) }}>课程配置</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }} >修改</Btn>
            <Btn type="danger" onClick={() => { this.dispatch(actions.showModal('delete', data)) }} >删除</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  modelFields = [
    {
      field: 'sort',
      formItemProps: {
        label: '模块序号'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '模块序号不能为空' },
          { pattern: /^[0-9]\d*$/, message: '序号格式不正确' }
        ],
      }
    }, {
      field: 'name',
      formItemProps: {
        label: '模块名称'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '模块名称不能为空' }
        ],
      }
    },
    {
      field: 'description',
      formItemProps: {
        label: '模块描述'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '模块描述不能为空' }
        ],
      },
      renderItem() {
        return <Input.TextArea />
      }
    },

  ]

  addMenu = () => this.dispatch(actions.showModal('add', { major_id: this.props.match.params.major_id }))

  editInitState = ({ modalParams }) => ({ model: modalParams })

  buttons = <IconButton size="small" icon="add" onClick={() => this.addMenu()}>添加</IconButton>

  render() {
    return (
      <Page
        actions={actions}
        columns={this.columns}
        buttons={this.buttons}
        initState={{ criteria: { major_id: this.props.match.params.major_id } }}
        selectId={i => i.module_id}
      >
        <FormModal
          title="添加模块"
          name="add"
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={(value, { major_id }) => this.dispatch(actions.add({ ...value, major_id, status: 1, disableReset: true }))}
        />
        <FormModal
          title="修改模块"
          name="edit"
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={(value, { module_id }) => this.dispatch(actions.edit({ ...value, module_id, status: 1, disableReset: true }))}
          initState={this.editInitState}
        />
        <ConfirmModal
          title="操作提示"
          name="delete"
          message={"删除后，记录将不可恢复，请确认操作！"}
          onCancel={() => this.dispatch(actions.hideModal('delete'))}
          onSave={({ module_id }) => this.dispatch(actions.delete({ module_id, disableReset: true }))}
        />
      </Page>
    )
  }
}).connect(() => ({}))
