import React from 'react'
import Base from 'common/base'
import PageTable from 'user/components/page-table'
import actions from 'user/actions/order'
import { ORDER_CHANNEL_TYPE, ORDER_STATUS } from 'common/config'
import PagePagination from 'common/page/page-pagination'
import Status from 'common/page/page-table-status'
import UserPage from 'user/components/user-page'
import Layout from 'user/components/layout'
import UserBanner from 'user/components/user-banner'
import Tooltip from 'common/tooltip'

export default (class extends Base {

  componentDidMount() {
    Promise.resolve(typeof (this.initState || {}) === 'object' ? Promise.resolve(this.initState) : this.initState()).then((initState) => {
      this.dispatch(actions.initPage(initState || {}))
      this.dispatch(actions.getPage())
    })
  }

  componentWillUnmount() {
    this.dispatch(actions.clearPage())
  }

  columns = [
    {
      title: '订单号',
      dataIndex: 'order_id',
      render(item) {
        return <Tooltip title={item.order_id} />
      }
    }, {
      title: '支付渠道',
      width: 150,
      dataIndex: 'channel_type',
      render: (item) => {
        return <Status onClick={() => { }} config={ORDER_CHANNEL_TYPE} value={item.channel_type} />
      }
    }, {
      title: '订单描述',
      width: 150,
      dataIndex: 'title',
      render(item) {
        return <Tooltip title={item.title} />
      }
    }, {
      title: '订单金额（元）',
      width: 150,
      dataIndex: 'money'
    }, {
      title: '状态',
      width: 150,
      dataIndex: 'status',
      render: (item) => {
        return <Status onClick={() => this.onClickRow(item)} config={ORDER_STATUS} value={item.status} />
      }
    }, {
      title: '订单时间',
      width: 200,
      dataIndex: 'up_time'
    }
  ]

  changePagination = (...args) => this.dispatch(actions.changePagination(...args))

  onClickRow = (item) => {
    const { status, order_id } = item
    if (status === '3') {
      window.open(`/order/pc/pay/${order_id}`)
    }
  }

  render() {
    const { isInit } = this.props
    if (!isInit) return null
    return (
      <Layout>
        <UserBanner />
        <UserPage fill title="我的订单">
          <PageTable
            actions={actions}
            columns={this.columns}
            selectId={(i, index) => i.order_id + index}
            onClickRow={this.onClickRow}
          />
          <PagePagination onChange={this.changePagination} />
        </UserPage >
      </Layout>
    )
  }
}).connect(state => {
  const { isInit } = state.page
  return {
    isInit
  }
})


