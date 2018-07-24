
import PageTable from 'common/page/page-table'
import React from 'react'

export default class extends React.Component {
  getContainer() {
    return document.querySelector('.user-page')
  }
  render() {
    return (
      <PageTable {...this.props} getContainer={this.getContainer} />
    )
  }
}