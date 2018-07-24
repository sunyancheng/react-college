import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import ConfirmModal from 'common/page/confirm-modal'
import actions from 'system/actions/user'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import Status from 'common/page/page-table-status'
import { FormModalStatic } from 'common/page/form-modal'
import { USER_STATUS, USER_ROLE } from 'common/config'
import { BtnGroup, Btn } from 'common/button-group'
import Portrait from 'common/portrait'

export default (class extends Base {
  columns = [
    {
      title: '用户ID',
      dataIndex: 'user_id'
    }, {
      title: '账号',
      dataIndex: 'tel'
    }, {
      title: '昵称',
      dataIndex: 'nickname'
    }, {
      title: '身份',
      dataIndex: 'role',
      render(item) {
        return <span>{(item.role_label || []).join(', ')}</span>
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      render(item) {
        return <Status config={USER_STATUS} value={item.status} />
      }
    }, {
      title: '注册时间',
      dataIndex: 'ctime'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('info', data)) }} >查看</Btn>
            {data.status == 2 ?
              <Btn
                type="danger"
                onClick={() => this.dispatch(actions.unfreeze(data.user_id))}
              >解冻</Btn>
              : <Btn type="danger" onClick={() => this.dispatch(actions.showModal('freeze', data))} >冻结</Btn>
            }
          </BtnGroup>
        )
      }
    }
  ]

  filters = [
    { label: '用户ID', name: 'user_id', render: renderInput },
    { label: '账号', name: 'tel', render: renderInput },
    { label: '身份', name: 'rolemask', options: USER_ROLE, render: renderSelect },
    { label: '昵称', name: 'nickname', render: renderInput },
    { label: '注册日期', name: 'range', render: renderRangePicker },
  ]

  viewModelFileds = [
    {
      render({ props, state }) {
        return props.form.getFieldDecorator('avatar', {
          initialValue: state.model.avatar
        })(
          <Portrait readonly style={{ position: 'absolute', top: 0, right: 20 }} />
        )
      }
    },
    ...[
      ['用户ID', 'user_id'],
      ['身份', 'role_label'],
      ['账号', 'tel'],
      ['账号状态', 'status_label'],
      ['邮箱', 'mail'],
      ['姓名', 'name'],
      ['昵称', 'nickname'],
      ['性别', 'gender_label'],
      ['生日', 'birthday'],
      ['城市', 'live_city'],
      ['注册时间', 'ctime'],
      ['个性签名', 'memo'],
    ].map(([label, field]) => ({
      field,
      formItemProps: { label },
      renderItem: 'static'
    }))]


  // 模拟获取一些下拉框的数据，有时候是写死，有时候是从数据库读出来
  initState = async ({ name, modalParams }) => {
    if (name === 'edit') {
      var model = await this.getModel(modalParams);
    }
    return {
      model
    }
  }

  render() {
    return (
      <Page
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        selectId={(i, index) => `${i}-${index}`}
        exportUrl="/home/user/admin/user/export"
      >
        <FormModalStatic
          title="用户信息"
          name="info"
          initState={({ modalParams }) => ({ model: modalParams })}
          modelFields={this.viewModelFileds}
          onCancel={() => this.dispatch(actions.hideModal('info'))}
        />
        <ConfirmModal
          title="操作提示"
          name="freeze"
          message={"冻结后，用户将无法登录平台，请确认操作！"}
          onCancel={() => this.dispatch(actions.hideModal('freeze'))}
          onSave={({ user_id }) => this.dispatch(actions.freeze(user_id))}
        />
      </Page>
    )
  }
}).connect(() => ({}))
