import React from 'react'
import Base from 'common/base'
import PageTable from 'user/components/page-table'
import actions from 'user/actions/message'
import ReadStatus from 'common/read-status'
import { MsgBtn } from 'common/button-group'
import { NOTICE_TYPE } from 'common/config'
import 'admin/routes/message/style.less'
import PagePagination from 'common/page/page-pagination'
import api from 'common/api'
import { Button } from 'common/button'
import ConfirmModal from 'common/page/confirm-modal'
import UserPage from 'user/components/user-page'
import Layout from 'user/components/layout'
import UserBanner from 'user/components/user-banner'
import { isStudentThen } from 'user/store'
import Alert from 'common/alert'
import MessageViewer from 'common/message-viewer'
import { PageAside } from 'common/page/page-layout'

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
      title: '消息标题',
      dataIndex: 'title',
      render: (item) => {
        return (
          <div className="message-title">
            <ReadStatus status={item.show} />
            <MsgBtn className="message-title__btn">{item.title}</MsgBtn>
          </div>)
      }
    }, {
      title: '类型',
      width: 200,
      dataIndex: 'type',
      render(item) {
        return <div>{NOTICE_TYPE.find(config => config.value == item.type).label}</div>
      }
    }, {
      title: '发布中心',
      width: 200,
      dataIndex: 'campus_name',
      render({ campus_name }) {
        return <div title={campus_name}>{campus_name}</div>
      }
    }, {
      width: 200,
      title: '发布时间',
      dataIndex: 'pub_time'
    }
  ]

  handleOperate = (status) => () => {
    const { checkedRows } = this.props
    const notice_ids = checkedRows.map(v => v.notice_id).join(',')
    status === 2 && this.dispatch(actions.setPageState({showMarkDown: false}))
    isStudentThen(api.updateStudentNoticeStatus, api.updateUserNoticeStatus)({ notice_ids, status })
      .then(() => this.dispatch(actions.getPage(), actions.setPageState({ checkedRows: [], checkedAll: false }), actions.setMessageNumber()))
      .then(() => Alert.info('操作成功'))
      .catch(() => Alert.error('操作失败，请稍后再试'))
  }

  handleGetDetail = async (item) => {
    const { notice_id } = item
    this.dispatch(actions.setPageState({ target_notice_id: notice_id }))
    const detail = await isStudentThen(api.studentMessageDetail, api.userMessageDetail)({ notice_id })
    this.dispatch(actions.setPageState({ markdown: detail, showMarkDown: true }))
    if (item.show === '1') {
      this.dispatch(actions.setRead(item), actions.setMessageNumber())
    }
  }

  buttons = (disabled) => [
    <Button disabled={disabled} key={1} ghost size="small" onClick={() => this.dispatch(actions.showModal('delete'))}>删除选中</Button>,
    <Button disabled={disabled} key={2} ghost size="small" onClick={this.handleOperate(1)}>标记已读</Button>,
  ]

  changePagination = (...args) => {
    this.dispatch(actions.changePagination(...args), actions.setPageState({ showMarkDown: false }))
  }

  onClickRow = (item) => {
    this.handleGetDetail(item)
  }

  render() {
    const { isInit, checkedRows } = this.props
    if (!isInit) return null
    return (
      <Layout>
        <UserBanner />
        <UserPage title="消息通知" fill buttons={this.buttons(checkedRows.length === 0)}>
          <PageAside>
            <PageTable
              actions={actions}
              columns={this.columns}
              selectId={(i, index) => i.notice_id + index}
              checkColumn
              onClickRow={this.onClickRow}
            />
            <MessageViewer actions={actions} />
          </PageAside>
          <PagePagination onChange={this.changePagination} />
          <ConfirmModal
            title="操作提示"
            name="delete"
            message={"是否删除已选定的消息通知?"}
            onCancel={() => this.dispatch(actions.hideModal('delete'))}
            onSave={this.handleOperate(2)}
          />
        </UserPage>
      </Layout>
    )
  }
}).connect(state => {
  const { checkedRows, isInit, checkedAll } = state.page
  return {
    checkedRows,
    isInit,
    checkedAll
  }
})


