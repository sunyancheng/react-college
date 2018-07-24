import React from 'react'
import Base from 'common/base'
import PageTable from 'user/components/page-table'
import actions from 'user/actions/experiment'
import { EXPERIMENT_LEVEL, EXPERIMENT_PROCESS_STATUS } from 'common/config'
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
      title: '实验ID',
      dataIndex: 'experiment_id'
    }, {
      title: '实验名称',
      dataIndex: 'name',
      render({ name }) {
        return <Tooltip title={name} />
      }
    }, {
      title: '实验老师',
      dataIndex: 'teacher'
    }, {
      title: '实验难度',
      dataIndex: 'level',
      render(item) {
        return <Status config={EXPERIMENT_LEVEL} value={item.level} />
      }
    }, {
      title: '上次试验时间',
      dataIndex: 'utime'
    }, {
      title: '实验状态',
      dataIndex: 'status',
      render(item) {
        return <Status config={EXPERIMENT_PROCESS_STATUS} value={item.status} />
      }
    }
  ]

  changePagination = (...args) => this.dispatch(actions.changePagination(...args))

  onClickRow = (item) => {
    const { course_id: cid, experiment_id: rid } = item
    const role = this.props.role.includes(2) ? '2' : '1'
    window.open(`/experiment/home/${role}/${cid}/${rid}`)
  }

  render() {
    const { isInit } = this.props
    if (!isInit) return null
    return (
      <Layout>
        <UserBanner />
        <UserPage title="我的实验" fill>
          <PageTable
            actions={actions}
            columns={this.columns}
            selectId={(i, index) => i.experiment_id + index}
            onClickRow={this.onClickRow}
          />
          <PagePagination onChange={this.changePagination} />
        </UserPage>
      </Layout>
    )
  }
}).connect(state => {
  const { isInit } = state.page
  const { role } = state.app.userInfo
  return {
    isInit,
    role
  }
})


