import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-breadcrumb'
import actions from 'system/actions/manage-admin'
import { IconButton } from 'common/button'
import FormModal from 'common/page/form-modal'
import ConfirmModal from 'common/page/confirm-modal'
import { BtnGroup, Btn } from 'common/button-group'

import { Select2 } from 'common/select'
import AccountInput from 'common/account-input'
import api from 'common/api'

export default (class extends Base {
  columns = [
    {
      title: '用户ID',
      dataIndex: 'user_id'
    }, {
      title: '姓名',
      dataIndex: 'user_name'
    }, {
      title: '角色ID',
      dataIndex: 'role_ids_arr',
      render({ role_ids_arr = [] }) {
        return role_ids_arr.join(';')
      }
    }, {
      title: '配置时间',
      dataIndex: 'ctime'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }} >角色关联</Btn>
            <Btn type="danger" onClick={() => { this.dispatch(actions.showModal('delete', data)) }} >删除</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  modelFields = [
    {
      render({ props, state }) {
        return <AccountInput disabled={state.disabled} defaultValue={state.model && state.model.account} form={props.form} />
      }
    }, {
      field: 'role_ids',
      formItemProps: {
        label: '选择角色'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '角色不能为空' },
        ],
      },
      renderItem({ state }) {
        return (<Select2 mode="multiple" placeholder="请选择" options={state.characters} getValue={i => i.value} getLabel={i => i.label} />)
      }
    },
  ]

  addMenu = () => this.dispatch(actions.showModal('add'))

  editInitState = async ({ modalParams }) => {
    modalParams.role_ids = modalParams.role_ids_arr
    const { list } = await api.systemManageRoleList()
    const characters = list ? ((Object.keys(list).map(key => ({ label: list[key].name, value: list[key].role_id, })))) : []
    return {
      model: modalParams,
      disabled: true,
      characters,
    }
  }

  newInitState = async () => {
    const { list } = await api.systemManageRoleList()
    const characters = list ? ((Object.keys(list).map(key => ({ label: list[key].name, value: list[key].role_id, })))) : []
    return {
      characters
    }
  }

  buttons = <IconButton size="small" icon="add" onClick={() => this.addMenu()}>添加管理员</IconButton>

  render() {
    return (
      <Page
        title="管理员列表"
        actions={actions}
        columns={this.columns}
        buttons={this.buttons}
        selectId={i => i.user_id}
      >
        <FormModal
          title="添加管理员"
          name="add"
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={({ role_ids, user_id }) => this.dispatch(actions.add({ user_id, role_ids }))}
          initState={this.newInitState}
        />
        <FormModal
          title="角色关联"
          name="edit"
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={({ role_ids }, { user_id, manager_role_map_id }) => this.dispatch(actions.edit({ role_ids, user_id, manager_role_map_id }))}
          initState={this.editInitState}
        />
        <ConfirmModal
          title="操作提示"
          name="delete"
          message={"删除后，记录将不可恢复，请确认操作！"}
          onCancel={() => this.dispatch(actions.hideModal('delete'))}
          onSave={({ manager_role_map_id }) => this.dispatch(actions.delete({ manager_role_map_id }))}
        />
      </Page>
    )
  }
}).connect(() => ({}))
