import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import actions from 'system/actions/refund'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import Status from 'common/page/page-table-status'
import { FormModalStatic, FormModalCombine } from 'common/page/form-modal'
import { ORDER_CHANNEL_TYPE, AUDIT_RESULT, REFUND_STATUS } from 'common/config'
import { Input, DatePicker } from 'antd'
import { cachedApi } from 'common/api'
import { BtnGroup, Btn } from 'common/button-group'
import { Select2 } from 'common/select'
import moment from 'moment'
const TextArea = Input.TextArea

export default (class extends Base {
  columns = [
    {
      title: '订单号',
      dataIndex: 'order_id',
      width: 260
    }, {
      title: '渠道',
      dataIndex: 'channel_type',
      render(item) {
        return <Status config={ORDER_CHANNEL_TYPE} value={item.channel_type} />
      }
    }, {
      title: '支付方式',
      dataIndex: 'pay_type',
      render: (item) => {
        return <span>{(this.props.bankList || {})[item.pay_type]}</span>
      }
    }, {
      title: '退款原因',
      dataIndex: 'reason',
    }, {
      title: '退款金额',
      dataIndex: 'money',
    }, {
      title: '退款人ID',
      dataIndex: 'refund_user_id',
    }, {
      title: '支付中心订单号',
      dataIndex: 'prepay_id',
      width: 200
    }, {
      title: '状态',
      dataIndex: 'status',
      render(item) {
        return <Status config={REFUND_STATUS} value={item.status} />
      }
    }, {
      title: '提交退款时间',
      dataIndex: 'ctime',
      width: 160
    }, {
      title: '审核时间',
      dataIndex: 'audit_time',
      // width: 170
    },
    {
      title: '退款到账时间',
      dataIndex: 'refund_time',
      // width: 170
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 90,
      render: (item) => {
        return this.renderOperation(item)
      }
    }
  ]
  filters = [
    { label: '订单号', name: 'order_id', render: renderInput },
    { label: '渠道', name: 'channel_type', options: ORDER_CHANNEL_TYPE, render: renderSelect },
    { label: '退款原因', name: 'reason', render: renderInput },
    { label: '退款人ID', name: 'refund_user_id', render: renderInput },
    { label: '支付中心订单号', name: 'prepay_id', render: renderInput },
    { label: '状态', name: 'status', options: REFUND_STATUS, render: renderSelect },
    { label: '退款日期', name: 'range', render: renderRangePicker },
  ]

  renderOperation = (item) => {
    const { channel_type, status } = item
    let buttonGroup = []
    if (['6'].includes(status)) {
      buttonGroup = [
        <Btn key={`audit-${channel_type}`} onClick={() => { this.dispatch(actions.showModal(`audit-${channel_type}`, item)) }} >审核</Btn>
      ]
    } else if (['8', '9'].includes(status)) {   // 7-退款中 8-已退款 9-退款失败
      buttonGroup = [
        <Btn key={`refund-${channel_type}`} onClick={() => { this.dispatch(actions.showModal(`refund-${channel_type}`, item)) }} >查看</Btn>
      ]
    } else if (status === '7') {
      if (channel_type === '1') {
        buttonGroup = [
          <Btn key="confirm" onClick={() => { this.dispatch(actions.showModal('confirm', item)) }} >确认到账</Btn>
        ]
      } else if (channel_type === '2') {
        buttonGroup = [
          <Btn key={`refund-${channel_type}`} onClick={() => { this.dispatch(actions.showModal(`refund-${channel_type}`, item)) }} >查看</Btn>
        ]
      }
    }
    return <BtnGroup>{buttonGroup}</BtnGroup>
  }

  initState = ({ modalParams: model }) => ({ model })

  initConfirmState = ({ modalParams: model }) => {
    return {
      model: {
        ...model,
        refund_time: moment()
      }
    }
  }

  generateFields = ([field, label, condition, fieldDecorator = {}, renderItem = 'static']) => ({
    field,
    condition,
    formItemProps: {
      label,
      labelCol: { span: 6 },
      wrapperCol: { span: 17 }
    },
    fieldDecorator,
    renderItem
  })

  auditCommonFields = (online = false, audit = true) => [
    ...[
      ['order_id', '订单号'],
      ['prepay_id', '支付中心订单号', () => online],
      ['create_uid', '用户ID'],
      ['reason', '退款原因'],
      ['money', '退款金额'],
      ['pay_type', '支付方式', undefined, undefined, ({ state: { model } }) => <div>{(this.props.bankList || {})[model.pay_type]}</div>],
      ['create_user', '发起退款人', undefined, undefined, ({ state: { model } }) => <div>{model.create_user.name}（{model.create_user.tel}）</div>],
      ['audit_user', '审核退款人', () => audit, undefined, ({ state: { model } }) => <div>{model.audit_user.name}（{model.audit_user.tel}）</div>]
    ].map(this.generateFields)
  ]

  auditFields = [
    {
      field: 'memo',
      formItemProps: {
        label: '备注',
        labelCol: { span: 6 },
        wrapperCol: { span: 17 }
      },
      renderItem() {
        return <TextArea placeholder="请输入，非必填" />
      }
    }, {
      field: 'result',
      formItemProps: {
        label: '审核结果',
        labelCol: { span: 6 },
        wrapperCol: { span: 17 }
      },
      renderItem() {
        return <Select2 showSearch options={AUDIT_RESULT} getValue={({ value }) => value} getLabel={({ label }) => label} />
      }
    }
  ]

  auditOfflineFields = [
    ...this.auditCommonFields(false, false),
    ...[
      ['card_no', '收款人银行卡号'],
      ['card_name', '持卡人姓名'],
      ['card_bank', '开户行'],
    ].map(this.generateFields),
    ...this.auditFields
  ]

  auditOnlineFields = [
    ...this.auditCommonFields(true, false),
    ...this.auditFields
  ]

  checkOnlineModelFields = [
    ...this.auditCommonFields(true, true),
    ...[
      ['memo', '备注'],
      ['refund_time', '到款时间']
    ].map(this.generateFields)
  ]
  checkOfflineModelFields = [
    ...this.auditCommonFields(false, true),
    ...[
      ['card_no', '收款人银行卡号'],
      ['card_name', '持卡人姓名'],
      ['card_bank', '开户行'],
      ['memo', '备注'],
      ['refund_time', '到款时间']
    ].map(this.generateFields),
    {
      field: 'ack_user',
      formItemProps: {
        label: '确认到账人',
        labelCol: { span: 6 },
        wrapperCol: { span: 17 }
      },
      renderItem({ state }) {
        const { ack_user } = state.model
        return (
          <div>{ack_user.name}（{ack_user.tel}）</div>
        )
      }
    }
  ]

  confirmModelFields = [
    ...this.auditCommonFields(),
    ...[
      ['card_no', '收款人银行卡号'],
      ['card_name', '持卡人姓名'],
      ['card_bank', '开户行'],
    ].map(this.generateFields),
    {
      field: 'memo',
      formItemProps: {
        label: '备注',
        labelCol: { span: 6 },
        wrapperCol: { span: 17 }
      },
      renderItem() {
        return <TextArea placeholder="请输入，非必填" />
      }
    }, {
      field: 'refund_time',
      formItemProps: {
        label: '到款时间',
        labelCol: { span: 6 },
        wrapperCol: { span: 17 }
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '到款时间不能为空' }
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      }
    }
  ]

  render() {
    return (
      <Page
        title="订单列表"
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        initState={cachedApi.getBankList}
        selectId={(i, index) => `${i.order_id}${index}`}
        exportUrl="/misc/order/admin/refund/export"
      >
        <FormModalCombine
          title="审核退款（支付中心）"
          name="audit-2"
          initState={this.initState}
          modelFields={this.auditOnlineFields}
          onCancel={() => this.dispatch(actions.hideModal("audit-2"))}
          onSave={(value, { pay_refund_id }) => this.dispatch(actions.refundAudit({ ...value, pay_refund_id }, 'audit-2'))}
        />
        <FormModalCombine
          title="审核退款（线下支付）"
          name="audit-1"
          initState={this.initState}
          modelFields={this.auditOfflineFields}
          onCancel={() => this.dispatch(actions.hideModal("audit-1"))}
          onSave={(value, { pay_refund_id }) => this.dispatch(actions.refundAudit({ ...value, pay_refund_id }, 'audit-1'))}
        />
        <FormModalStatic
          title="查看退款（线下支付）"
          name="refund-1"
          initState={this.initState}
          modelFields={this.checkOfflineModelFields}
          onCancel={() => this.dispatch(actions.hideModal("refund-1"))}
        />
        <FormModalStatic
          title="查看退款（支付中心）"
          name="refund-2"
          initState={this.initState}
          modelFields={this.checkOnlineModelFields}
          onCancel={() => this.dispatch(actions.hideModal("refund-2"))}
        />
        <FormModalCombine
          title="确认到账（线下支付）"
          name="confirm"
          initState={this.initConfirmState}
          dateFormat="YYYY-MM-DD HH:mm:ss"
          modelFields={this.confirmModelFields}
          onCancel={() => this.dispatch(actions.hideModal('confirm'))}
          onSave={(value, { pay_refund_id }) => this.dispatch(actions.refundAck({ ...value, pay_refund_id }))}
        />
      </Page>
    )
  }
}).connect((state) => {
  const bankList = state.page.bankList
  return {
    bankList
  }
})
