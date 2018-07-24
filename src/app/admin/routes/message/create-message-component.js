import React from 'react'
import Base from 'common/base'
import ConfirmModal from 'common/page/confirm-modal'
import { Button } from 'common/button'
import { NOTICE_TYPE } from 'common/config'
import ReadStatus from 'common/read-status'
import { MsgBtn } from 'common/button-group'
import PagePagination from 'common/page/page-pagination'
import { PageLayout, PageContent, PageHeader } from 'common/page/page-layout'
import PageTable from 'common/page/page-table'
import MessageViewer from 'common/message-viewer'
import Alert from 'common/alert'
import { PageAside } from 'common/page/page-layout'
import './style.less'

const { Rest } = PageContent
export default function ({ actions, updateApi, detailApi }) {
  return (class extends Base {
    state = {
      isShow: false
    }

    componentDidMount() {
      this.dispatch(actions.initPage())
      this.dispatch(actions.getPage())
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
              <MsgBtn className="message-title__btn"><div>{item.title}</div></MsgBtn>
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
        dataIndex: 'campus_name'
      }, {
        title: '发布时间',
        width: 200,
        dataIndex: 'pub_time'
      }
    ]

    handleOperate = (status) => () => {
      const { checkedRows } = this.props
      const notice_ids = checkedRows.map(v => v.notice_id).join(',')
      status === 2 && this.dispatch(actions.setPageState({ showMarkDown: false }))
      updateApi({ notice_ids, status })
        .then(() => {
          this.dispatch(actions.getPage(), actions.setPageState({ checkedRows: [], checkedAll: false }), actions.setMessageNumber())
          Alert.info('操作成功')
        })
    }

    handleGetDetail = (item) => {
      const { notice_id } = item
      this.dispatch(actions.setPageState({ target_notice_id: notice_id }))
      detailApi({ notice_id }).then(detail => {
        this.dispatch(actions.setPageState({ markdown: detail, showMarkDown: true }))
        if (item.show === '1') {
          this.dispatch(actions.setRead(item), actions.setMessageNumber())
        }
      })
    }

    buttons = (disabled) => [
      <Button disabled={disabled} key={1} ghost size="small" onClick={() => this.dispatch(actions.showModal('delete'))}>删除选中</Button>,
      <Button disabled={disabled} key={2} ghost size="small" onClick={this.handleOperate(1)}>标记已读</Button>,
    ]

    changePagination = (...args) => this.dispatch(actions.changePagination(...args))

    onClickRow = (item) => {
      this.handleGetDetail(item)
    }

    render() {
      const { isInit } = this.props
      if (!isInit) return null
      return (
        <PageLayout>
          <PageHeader actions={actions} title="消息通知" btn={this.buttons(this.props.checkedRows.length === 0)} />
          <PageContent>
            <Rest>
              <PageAside>
                <PageTable
                  actions={actions}
                  columns={this.columns}
                  selectId={(i) => i.notice_id}
                  checkColumn
                  onClickRow={this.onClickRow}
                />
                <MessageViewer actions={actions} />
              </PageAside>
              <PagePagination onChange={this.changePagination} />
            </Rest>
          </PageContent>
          <ConfirmModal
            title="操作提示"
            name="delete"
            message={"是否删除已选定的消息通知?"}
            onCancel={() => this.dispatch(actions.hideModal('delete'))}
            onSave={this.handleOperate(2)}
          />
        </PageLayout>
      )
    }
  }).connect(state => {
    const { campus_id } = state.app
    const { checkedRows, isInit } = state.page
    return {
      campus_id,
      checkedRows,
      isInit
    }
  });
}
