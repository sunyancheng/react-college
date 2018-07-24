import React from 'react'
import Base from 'common/base'
import PageTable from 'user/components/page-table'
import actions from 'user/actions/user-qa'
import { ANSWER_STATUS } from 'common/config'
import PagePagination from 'common/page/page-pagination'
import Status from 'common/page/page-table-status'
import UserPage from 'user/components/user-page'
import Layout from 'user/components/layout'
import UserBanner from 'user/components/user-banner'
import { FormModalStatic } from 'common/page/form-modal'
import api from 'common/api'
import Tooltip from 'common/tooltip'

export default (class extends Base {

  componentDidMount() {
    this.dispatch(actions.initPage({}))
    this.dispatch(actions.getPage())
  }

  componentWillUnmount() {
    this.dispatch(actions.clearPage())
  }

  columns = [
    {
      title: '问题编号',
      width: 200,
      dataIndex: 'qa_id'
    }, {
      title: '提问课程',
      width: 200,
      dataIndex: 'course'
    }, {
      title: '问题',
      dataIndex: 'question',
      render: ({ question }) => {
        return <Tooltip title={question} />
      }
    }, {
      title: '问题状态',
      dataIndex: 'status',
      width: 200,
      render(item) {
        return <Status config={ANSWER_STATUS} value={item.status} />
      }
    }, {
      title: '提问日期',
      width: 200,
      dataIndex: 'ctime'
    }
  ]

  changePagination = (...args) => this.dispatch(actions.changePagination(...args))

  initState = async ({ modalParams }) => {
    const { qa_id } = modalParams
    const model = await api.userQAListDetail({ qa_id })
    return {
      model
    }
  }

  checkFields = [
    {
      field: 'ctime',
      formItemProps: {
        label: '提问时间',
      },
      renderItem: 'static'
    }, {
      field: 'course',
      formItemProps: {
        label: '提问课程',
      },
      renderItem: 'static'
    }, {
      field: 'question',
      formItemProps: {
        label: '问题',
      },
      renderItem: 'static'
    }, {
      field: 'answer',
      formItemProps: {
        label: '回复内容',
      },
      renderItem({ state }) {
        return (<div>{state.model.status === '2' ? '待回复' : state.model.answer}</div>)
      }
    }, {
      field: 'teacher',
      condition({ model }) {
        return model.status !== '2'
      },
      formItemProps: {
        label: '回复人',
      },
      renderItem: 'static'
    }, {
      field: 'utime',
      condition({ model }) {
        return model.status !== '2'
      },
      formItemProps: {
        label: '回复时间',
      },
      renderItem: 'static'
    }
  ]

  render() {
    const { isInit } = this.props
    if (!isInit) return null
    return (
      <Layout>
        <UserBanner />
        <UserPage fill title="我的问答">
          <PageTable
            actions={actions}
            columns={this.columns}
            selectId={(i, index) => i.qa_id + index}
            onClickRow={(item) => this.dispatch(actions.showModal('check', item))}
          />
          <PagePagination onChange={this.changePagination} />
          <FormModalStatic
            name="check"
            title="查看答复"
            initState={this.initState}
            modelFields={this.checkFields}
            onCancel={() => this.dispatch(actions.hideModal('check'))}
          />
        </UserPage>
      </Layout>
    )
  }
}).connect(state => {
  const { isInit } = state.page
  return {
    isInit
  }
})

