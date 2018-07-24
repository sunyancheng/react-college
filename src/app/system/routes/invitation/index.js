import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-breadcrumb'
import actions from 'system/actions/invitation'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import Status from 'common/page/page-table-status'
import FormModal, { FormModalStatic } from 'common/page/form-modal'
import { INVITATION_STATUS } from 'common/config'
import { BtnGroup, Btn } from 'common/button-group'
import { IconButton } from 'common/button'
import { Cascader } from 'antd'
import ConfirmModal from 'common/page/confirm-modal'
import { RadioGroup2 } from 'common/radio-group'
import Provinces from 'common/config/provinces'
import Tooltip from 'common/tooltip'
import api from 'common/api'

export default (class extends Base {
  columns = [
    {
      title: '邀请码',
      dataIndex: 'invitation_code_id'
    }, {
      title: '邀请人',
      dataIndex: 'name',
      render({ name }) {
        return <Tooltip title={name} />
      }
    }, {
      title: '手机号',
      dataIndex: 'phone'
    }, {
      title: '城市',
      dataIndex: 'city'
    }, {
      title: '是否可用',
      dataIndex: 'status',
      render(item) {
        return <Status config={INVITATION_STATUS} value={item.status} />
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
            <Btn onClick={() => { this.dispatch(actions.showModal('qrcode', data)) }} >二维码</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }} >修改</Btn>
            <Btn type="danger" onClick={() => { this.dispatch(actions.showModal('delete', data)) }} >删除</Btn>
          </BtnGroup>
        )
      }
    }
  ]
  filters = [
    { label: '邀请码', name: 'invitation_code', render: renderInput },
    { label: '手机号', name: 'phone', render: renderInput },
    { label: '状态', name: 'status', options: INVITATION_STATUS, render: renderSelect },
    { label: '创建日期', name: 'range', render: renderRangePicker },
    { label: '城市', name: 'city', render: renderInput }
  ]

  qrcodeModelFields = [
    {
      field: 'code',
      formItemProps: {
        label: '邀请码',
      },
      renderItem({ state }) {
        return (<span>{state.code}</span>)
      }
    },
    {
      field: 'code',
      formItemProps: {
        label: '邀请链接',
      },
      renderItem({ state }) {
        return (<span>{state.url}</span>)
      }
    },
    {
      field: 'code',
      formItemProps: {
        label: '二维码',
      },
      renderItem({ state }) {
        return (
          <a href={state.base64} download={`${state.name}邀请码${state.code}.jpg`}>
            <img src={state.base64} width="200" />
          </a>)
      }
    }
  ]

  modelFields = [
    {
      field: 'name',
      formItemProps: {
        label: '邀请人姓名',
        labelCol: { span: 5 },
        wrapperCol: { span: 18 }
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '姓名不能为空' }
        ],
      }
    },
    {
      field: 'phone',
      formItemProps: {
        label: '邀请人手机号',
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' }
        ],
      }
    },
    {
      field: 'city',
      formItemProps: {
        label: '城市',
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '城市不能为空' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return (
          <Cascader showSearch options={Provinces} placeholder="请选择" />
        )
      }
    }
  ]

  modelFieldStatus = [{
    field: 'status',
    formItemProps: {
      label: '是否可用',
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    },
    renderItem() {
      return (
        <RadioGroup2 options={INVITATION_STATUS} />
      )
    }
  }]

  buttons = <IconButton size="small" icon="add" onClick={() => { this.dispatch(actions.showModal('add')) }}>新建</IconButton>

  initState = ({ modalParams }) => {
    const { province, city, ...rest } = modalParams
    return Promise.resolve({
      model: { ...rest, city: [province, city] }
    })
  }

  initQRCodeState = ({ modalParams }) => {
    const code = modalParams.invitation_code_id
    const url = window.location.origin + '/invitation/' + code
    return api.getQRCode({ url }).then(base64 => ({
      code, url, base64, ...modalParams
    }))
  }

  formatModelData({ city, ...rest }) {
    return {
      ...rest,
      province: city[0], city: city[1]
    }
  }
  hideQRCode = () => {
    this.dispatch(actions.hideModal('qrcode'))
  }
  render() {

    return (
      <Page
        title="邀请码列表"
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        buttons={this.buttons}
        selectId={i => i.invitation_code_id}
      >
        <FormModalStatic
          title="二维码"
          name="qrcode"
          modelFields={this.qrcodeModelFields}
          initState={this.initQRCodeState}
          onCancel={this.hideQRCode}
          onSave={this.hideQRCode}
        />
        <FormModal
          title="新增邀请"
          name="add"
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={data => this.dispatch(actions.add(this.formatModelData(data)))}
        />
        <FormModal
          title="修改邀请"
          name="edit"
          modelFields={this.modelFields.concat(this.modelFieldStatus)}
          initState={this.initState}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={(data, modalParams) => this.dispatch(actions.edit(
            {
              invitation_code_id: modalParams.invitation_code_id,
              ...this.formatModelData(data)
            }
          ))}
        />
        <ConfirmModal
          title="删除"
          name="delete"
          onCancel={() => this.dispatch(actions.hideModal('delete'))}
          onSave={({ invitation_code_id }) => this.dispatch(actions.delete({ invitation_code_id }))}
        />
      </Page>
    )
  }
}).connect(() => ({}))
