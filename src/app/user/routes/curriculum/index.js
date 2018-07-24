import React from 'react'
import Base from 'common/base'
import TimeTable from 'common/timetable';
import moment from 'moment'
import actions from 'user/actions/curriculum'
import UserPage from 'user/components/user-page'
import Layout from 'user/components/layout'
import UserBanner from 'user/components/user-banner'
import PagePagination from 'common/page/page-pagination'
export default (class extends Base {

  componentWillMount() {
    this.dispatch(actions.initPage({ criteria: { tdate: moment().format('YYYY-MM-DD') } }))
    this.dispatch(actions.getList())
  }

  componentWillUnmount() {
    this.dispatch(actions.clearPage())
  }

  changePagination = (...args) => this.dispatch(actions.changePagination(...args))

  print () {
    window.print();
  }

  render() {
    const { isInit } = this.props
    if (!isInit) return null
    return (
      <Layout scrollable>
        <UserBanner />
        <UserPage title="我的课表">
          <TimeTable
            readOnly
            onChange={(tdate) => this.dispatch(actions.getList({ tdate, class_id: this.props.class_id }))}
            data={this.props.timetable}
            left={this.props.major}
          />
          <PagePagination onChange={this.changePagination} />
        </UserPage>
      </Layout>
    )
  }
}).connect(state => {
  const { isInit, data = { timetable: [] } } = state.page
  return {
    isInit,
    timetable: data,
    major: data.major,
  }
})