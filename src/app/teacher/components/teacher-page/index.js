import React from 'react'
import Layout from 'user/components/layout'
import Banner from 'teacher/components/teacher-banner'
import 'user/components/user-page/style.less'
import UserPage from 'user/components/user-page'

export default class extends React.Component {

  render() {
    const { title, buttons, children, fill } = this.props
    return (
      <Layout scrollable>
        <Banner />
        <UserPage fill={fill} title={title} buttons={buttons}>
          {children}
        </UserPage>
      </Layout>
    )
  }
}
