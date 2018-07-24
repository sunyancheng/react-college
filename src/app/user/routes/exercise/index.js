import React from 'react'
import Base from 'common/base'
import PageTable from 'user/components/page-table'
import actions from 'user/actions/exercise'
import PagePagination from 'common/page/page-pagination'
import UserPage from 'user/components/user-page'
import Layout from 'user/components/layout'
import UserBanner from 'user/components/user-banner'
import { renderTime } from 'common/time'
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
      title: '练习编号',
      dataIndex: 'exam_id'
    }, {
      title: '课程名称',
      dataIndex: 'course_name',
      render({ course_name }) {
        return <Tooltip title={course_name} />
      }
    }, {
      title: '练习名称',
      dataIndex: 'name',
      render({ name }) {
        return <Tooltip title={name} />
      }
    }, {
      title: '练习成绩',
      dataIndex: 'score'
    }, {
      title: '练习时长',
      dataIndex: 'time',
      render(data) {
        return <span>{renderTime(data.time)}</span>
      }
    }, {
      title: '练习时间',
      dataIndex: 'utime'
    }
  ]

  changePagination = (...args) => this.dispatch(actions.changePagination(...args))

  render() {
    const { isInit } = this.props
    if (!isInit) return null
    return (
      <Layout>
        <UserBanner />
        <UserPage title="我的练习" fill>
          <PageTable
            actions={actions}
            columns={this.columns}
            selectId={(i, index) => i.exam_id+ index}
            onClickRow={(item) => window.open(`/exam/home/student/${item.course_id}/${item.exam_id}`)}
          />
          <PagePagination onChange={this.changePagination} />
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

