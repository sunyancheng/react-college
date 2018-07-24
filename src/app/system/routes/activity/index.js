import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import actions from 'system/actions/activity'
import { renderInput, renderSelect, renderDatePicker } from 'common/page/page-filter/filter'
import { DatePicker, Form, Input } from 'antd'
import Status from 'common/page/page-table-status'
import FormModal, { FormModalStatic } from 'common/page/form-modal'
import { ACTIVITY_STATUS } from 'common/config'
import { BtnGroup, Btn } from 'common/button-group'
import { IconButton } from 'common/button'
import { RadioGroup2 } from 'common/radio-group'
import Portrait from 'common/portrait'
import api from 'common/api'
import moment from 'moment'
import cashValidator from 'common/cash-validator'

export default (class extends Base {
  columns = [
    {
      title: '活动ID',
      dataIndex: 'activity_id'
    }, {
      title: '活动标题',
      dataIndex: 'title'
    }, {
      title: '金额（元）',
      dataIndex: 'money'
    }, {
      title: '状态',
      dataIndex: 'status',
      render(item) {
        return <Status config={ACTIVITY_STATUS} value={item.status} />
      }
    }, {
      title: '开始时间',
      dataIndex: 'start_time'
    }, {
      title: '截止时间',
      dataIndex: 'end_time'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('qrcode', data)) }} >二维码</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }} >修改</Btn>
          </BtnGroup>
        )
      }
    }
  ]
  filters = [
    { label: '活动ID', name: 'activity_id', render: renderInput },
    { label: '活动标题', name: 'title', render: renderInput },
    { label: '活动状态', name: 'status', options: ACTIVITY_STATUS, render: renderSelect },
    { label: '开始日期', name: 'start_time', render: renderDatePicker },
    { label: '截止日期', name: 'end_time', render: renderDatePicker },
  ]

  renderDatePicker = ({ state, props, label, field }) =>
    <Form.Item label={label} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>{props.form.getFieldDecorator(field, {
      initialValue: state.model ? state.model[field] : moment(),
      rules: [
        { required: true, message: `${label}不能为空` },
      ],
      validateTrigger: 'onChange'
    })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}</Form.Item>

  modelFields = [
    {
      render({ props, state }) {
        return props.form.getFieldDecorator('pic', {
          initialValue: (state.model || {}).pic,
          // rules: [
          //   { required: true, message: '课程封面不能为空' },
          // ],
        })(
          <Portrait accept=".jpg,.png,,.jpeg" help style={{ position: 'absolute', top: 0, right: 20 }} />
        )
      }
    },
    {
      field: 'title',
      formItemProps: {
        label: '活动标题',
        labelCol: { span: 4 },
        wrapperCol: { span: 8 }
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '活动标题不能为空' },
          { max: 30, message: '活动标题不能超过30个字符' },
        ],
      }
    },
    {
      field: 'money',
      formItemProps: {
        label: '金额（元）',
        labelCol: { span: 4 },
        wrapperCol: { span: 8 }
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '金额不能为空' },
          { validator: cashValidator }
        ]
      }
    },
    {
      render: ({ props, state }) => {
        return this.renderDatePicker({ props, state, label: '开始时间', field: 'start_time' })
      }
    },
    {
      render: ({ props, state }) => {
        return this.renderDatePicker({ props, state, label: '截止时间', field: 'end_time' })
      }
    },
    {
      field: 'status',
      formItemProps: {
        label: '活动状态'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '活动状态不能为空' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return <RadioGroup2 options={ACTIVITY_STATUS} getValue={({ value }) => value} getLabel={({ label }) => label} />
      }
    },
    {
      field: 'memo',
      formItemProps: {
        label: '活动说明'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '活动说明不能为空' },
        ]
      },
      renderItem() {
        return <Input.TextArea />
      }
    },
  ]

  qrcodeModelFields = [
    {
      field: 'activity_id',
      formItemProps: {
        label: '活动ID',
      },
      renderItem({ state }) {
        return (<span>{state.activity_id}</span>)
      }
    },
    {
      field: 'url',
      formItemProps: {
        label: '订单链接',
        wrapperCol: { span: 20 }
      },
      renderItem({ state }) {
        return (<a href={`${state.url}`} target="__blank">{state.url}</a>)
      }
    },
    {
      field: 'qrcode',
      formItemProps: {
        label: '二维码',
      },
      renderItem({ state }) {
        return (
          <a href={state.base64} download={`${state.title}活动二维码.jpg`}>
            <img src={state.base64} width="200" />
          </a>)
      }
    }
  ]

  buttons = <IconButton size="small" icon="add" onClick={() => { this.dispatch(actions.showModal('add')) }}>新建</IconButton>

  initState = ({ modalParams }, momentize) => {
    return Promise.resolve({
      model: momentize(modalParams, ['end_time', 'start_time'], 'YYYY-MM-DD HH:mm:ss')
    })
  }

  initQRCodeState = ({ modalParams }) => {
    const activity_id = modalParams.activity_id
    const url = window.location.origin + '/order/pc/order/' + activity_id
    return api.getQRCode({ url: url.replace('/pc/', '/m/') }).then(base64 => ({
      url, base64, ...modalParams
    }))
  }

  formatModelData(values) { return values }

  hideQRCode = () => {
    this.dispatch(actions.hideModal('qrcode'))
  }
  render() {
    return (
      <Page
        title="活动列表"
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        buttons={this.buttons}
        selectId={i => i.activity_id}
        exportUrl="/misc/activity/admin/activity/export"
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
          title="新增活动"
          name="add"
          initState={() => ({ model: { status: '1' } })}
          modelFields={this.modelFields}
          dateFormat="YYYY-MM-DD HH:mm:ss"
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={data => this.dispatch(actions.add(this.formatModelData(data)))}
        />
        <FormModal
          title="修改活动"
          name="edit"
          modelFields={this.modelFields}
          initState={this.initState}
          dateFormat="YYYY-MM-DD HH:mm:ss"
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={(data, modalParams) => this.dispatch(actions.edit(
            {
              activity_id: modalParams.activity_id,
              ...this.formatModelData(data)
            }
          ))}
        />
      </Page>
    )
  }
}).connect(() => ({}))
