import React from 'react'
import Page from 'common/page'
import BreadCrumb from 'common/breadcrumb'

export default class extends React.Component {
  render() {
    const { children, ...rest } = this.props
    return (
      <Page {...rest} title={<BreadCrumb />}>
        {children}
      </Page>
    )
  }
}
