import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import actions from 'system/actions/order'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import Status from 'common/page/page-table-status'
import FormModal, { FormModalStatic, FormModalCombine } from 'common/page/form-modal'
import ConfirmModal from 'common/page/confirm-modal'
import { Select2 } from 'common/select'
import { ORDER_STATUS, ORDER_CHANNEL_TYPE, ORDER_PAY_TYPE } from 'common/config'
import { IconButton } from 'common/button'
import AccountInput from 'common/account-input'
import { Input, DatePicker } from 'antd'
const TextArea = Input.TextArea
import { cachedApi } from 'common/api'
import Tooltip from 'common/tooltip'
import { BtnGroup, Btn } from 'common/button-group'
import api from 'common/api'
import cashValidator from 'common/cash-validator'
import moment from 'moment'
import Alert from 'common/alert'

export default (class extends Base {
  columns = [
    {
      title: '订单号',
      dataIndex: 'order_id',
      width: 250,
    }, {
      title: '用户ID',
      dataIndex: 'user_id',
      width: 100
    }, {
      title: '渠道',
      dataIndex: 'channel_type',
      width: 220,
      render(item) {
        return (
          <div>
            <Status key="1" config={ORDER_CHANNEL_TYPE} value={item.channel_type} />
            {item.channel_type === '2' && ['1', '5', '6', '7', '8', '9'].includes(item.status) && <span key="2">&nbsp;&nbsp;{item.prepay_id}</span>}
          </div>
        )
      }
    }, {
      title: '支付方式',
      dataIndex: 'pay_type',
      render: (item) => {
        return <span>{(this.props.bankList || {})[item.pay_type]}</span>
      }
    }, {
      title: '订单描述',
      dataIndex: 'title',
      render: (item) => {
        return <Tooltip title={item.title} />
      }
    }, {
      title: '订单金额（元）',
      dataIndex: 'money'
    }, {
      title: '状态',
      dataIndex: 'status',
      render(item) {
        return <Status config={ORDER_STATUS} value={item.status} />
      }
    }, {
      title: '订单时间',
      dataIndex: 'up_time'
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 110,
      render: (item) => {
        return (
          <BtnGroup>
            {['1', '5'].includes(item.status) && item.can_refund === '1' && <Btn onClick={() => { this.dispatch(actions.showModal(`refund-${ORDER_CHANNEL_TYPE.find(v => v.value === item.channel_type).value}`, item)) }} >退款</Btn>}
            {['6', '7', '8', '9'].includes(item.status) && <Btn onClick={() => { this.dispatch(actions.showModal(`check-${ORDER_CHANNEL_TYPE.find(v => v.value === item.channel_type).value}`, item)) }} >查看</Btn>}
            { ['9'].includes(item.status) && <Btn onClick={() => this.dispatch(actions.showModal('cancel', item))}>取消</Btn>}
          </BtnGroup>
        )

      }
    }
  ]
  filters = [
    { label: '订单号', name: 'order_id', render: renderInput },
    { label: '用户ID', name: 'user_id', render: renderInput },
    { label: '状态', name: 'status', options: ORDER_STATUS, render: renderSelect },
    { label: '支付中心订单号', name: 'prepay_id', render: renderInput },
    { label: '订单日期', name: 'range', render: renderRangePicker },
    { label: '订单渠道', name: 'channel_type', options: ORDER_CHANNEL_TYPE, render: renderSelect },
  ]

  initRefundState = ({ modalParams }) => {
    return {
      model: modalParams
    }
  }

  checkInitState = async ({ modalParams }) => {
    const { prepay_id, order_id } = modalParams
    const model = await api.systemOrderRefundDetail({ prepay_id, order_id })
    return {
      model
    }
  }

  createState = () => ({ model: { time: moment() } })

  generateFields = (mode = 'static') => ([field, label, condition, fieldDecorator = {}, renderItem = mode]) => ({
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

  commonFields = (online = false) => [
    ...[
      ['order_id', '订单号'],
      ['prepay_id', '支付中心订单号', () => online],
      ['user_id', '用户ID'],
      ['reason', '退款原因', undefined, { rules: [{ required: true, message: '退款原因不能为空' }] }, function () { return <TextArea /> }],
      ['money', '退款金额', undefined, { rules: [{ required: true, message: '退款不能为空' }, { validator: cashValidator }] }, null]
    ].map(this.generateFields())
  ]

  refundField_2 = [
    ...this.commonFields(true),
    {
      field: 'memo',
      formItemProps: {
        label: '备注',
        labelCol: { span: 6 },
        wrapperCol: { span: 17 }
      }
    }
  ]

  refundField_1 = [
    ...this.commonFields(),
    ...[
      ['card_no', '银行卡号'],
      ['card_name', '持卡人姓名'],
      ['card_bank', '开户行'],
      ['memo', '备注'],
    ].map(this.generateFields(null))
  ]

  checkBaseFields = (online = false) => [
    ...[
      ['order_id', '订单号'],
      ['prepay_id', '支付中心订单号', () => online],
      ['create_uid', '用户ID'],
      ['reason', '退款原因'],
      ['money', '退款金额'],
      ['pay_type', '支付方式', undefined, undefined, ({ state: { model } }) => <div>{(this.props.bankList || {})[model.pay_type]}</div>],
      ['create_user', '发起退款人', undefined, undefined, ({ state: { model } }) => <div>{model.create_user.name}（{model.create_user.tel}）</div>],
      ['audit_user', '审核退款人', undefined, undefined, ({ state: { model } }) => <div>{model.audit_user.name} {model.audit_user.tel ? `（${model.audit_user.tel}）` : null}</div>]
    ].map(this.generateFields())
  ]

  checkOnlineModelFields = [
    ...this.checkBaseFields(true),
    ...[
      ['memo', '备注'],
      ['refund_time', '到款时间']
    ].map(this.generateFields())
  ]
  checkOfflineModelFields = [
    ...this.checkBaseFields(false),
    ...[
      ['card_no', '收款人银行卡号'],
      ['card_name', '持卡人姓名'],
      ['card_bank', '开户行'],
      ['memo', '备注'],
      ['refund_time', '到款时间'],
      ['ack_user', '确认到账人', undefined, undefined, ({ state: { model } }) => <div>{model.ack_user.name} {model.ack_user.tel ? `（${model.ack_user.tel}）` : null}</div>]
    ].map(this.generateFields())
  ]

  modelFields = [
    {
      field: 'order_id',
      formItemProps: {
        label: '订单号',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '订单号不能为空' },
          { pattern: /^[0-9]{15}$/, message: '订单号格式不正确' }
        ],
      },
      renderItem() {
        return (<Input placeholder="中心编码+日期+3位顺序，如900120180603001" />)
      }
    },
    {
      field: 'pay_type',
      hasPopupContainer: true,
      formItemProps: {
        label: '支付方式'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '支付方式不能为空' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return (<Select2 placeholder="POS刷卡/转账/其他" options={ORDER_PAY_TYPE} getValue={i => i.value} getLabel={i => i.label} />)
      }
    }, {
      render({ props }) {
        return <AccountInput form={props.form} />
      }
    }, {
      field: 'info',
      formItemProps: {
        label: '订单描述'
      },
      renderItem() {
        return <TextArea placeholder="请输入订单相关说明" />
      }
    },
    {
      field: 'money',
      formItemProps: {
        label: '金额(元)'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '金额不能为空' },
          { pattern: /^[0-9]+(\.\d{1,2})?$/, message: '请输入正确的金额, 支持小数点后两位' }
        ],
      },
    },
    {
      field: 'time',
      formItemProps: {
        label: '订单时间'
      },
      hasPopupContainer: true,
      fieldDecorator: {
        rules: [
          { required: true, message: '订单时间不能为空' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return (
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        )
      }
    }
  ]

  addMenu = () => this.dispatch(actions.showModal('add'))

  buttons = <IconButton size="small" icon="add" onClick={() => this.addMenu()}>录入订单</IconButton>

  onCancel = ({ order_id, prepay_id }) => {
    api.systemOrderRefundCancel({ order_id, prepay_id })
      .then(() => {
        Alert.success("操作成功")
        this.dispatch(actions.getPage({ page: '1' }) ,actions.hideModal('cancel'))
      })
  }

  render() {
    return (
      <Page
        title="订单列表"
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        buttons={this.buttons}
        initState={cachedApi.getBankList}
        selectId={(i, index) => `${i.order_id}${index}`}
        exportUrl="/misc/order/admin/order/export"
      >
        <FormModal
          title="录入订单"
          name="add"
          initState={this.createState}
          modelFields={this.modelFields}
          dateFormat="YYYY-MM-DD HH:mm:ss"
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={(value) => this.dispatch(actions.add(value))}
        />
        <FormModalCombine
          title="发起退款（线下支付）"
          name="refund-1"
          initState={this.initRefundState}
          modelFields={this.refundField_1}
          onCancel={() => this.dispatch(actions.hideModal('refund-1'))}
          onSave={(value, { order_id }) => this.dispatch(actions.offlineRefund({ ...value, order_id }))}
        />
        <FormModalCombine
          title="发起退款（支付中心）"
          name="refund-2"
          initState={this.initRefundState}
          modelFields={this.refundField_2}
          onCancel={() => this.dispatch(actions.hideModal('refund-2'))}
          onSave={(value, { order_id, prepay_id }) => this.dispatch(actions.onlineRefund({ ...value, order_id, prepay_id }))}
        />
        <FormModalStatic
          title="查看退款（线下支付）"
          name="check-1"
          modelFields={this.checkOfflineModelFields}
          initState={this.checkInitState}
          onCancel={() => this.dispatch(actions.hideModal('check-1'))}
        />
        <FormModalStatic
          title="查看退款（支付中心）"
          name="check-2"
          initState={this.checkInitState}
          modelFields={this.checkOnlineModelFields}
          onCancel={() => this.dispatch(actions.hideModal('check-2'))}
        />
        <ConfirmModal
          title="操作提示"
          name="cancel"
          message={"确认取消退款？"}
          onCancel={() => this.dispatch(actions.hideModal('cancel'))}
          onSave={({ order_id, prepay_id }) => this.onCancel({ order_id, prepay_id })}
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
