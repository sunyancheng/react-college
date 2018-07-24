import React from 'react'
import Base from 'common/base'
import ConfirmModal from 'common/page/confirm-modal'
import Page from 'common/page/page-with-breadcrumb'
import { baseURL } from 'common/request/config'
import { createPageActions } from 'common/page/create-page-actions'
import { momentToString } from 'common/page/create-page-actions'

const actions = createPageActions({
  initState: {},
  getListApi: () => { },
})

export default (class extends Base {
  render() {
    const { queryCriteria, children, ...rest } = this.props
    const exportUrl = this.props.exportUrl
    let queryParams = ''
    let url
    if (exportUrl) {
      url = exportUrl.split('?')[0]
      queryParams += (exportUrl.split('?')[1] || '').split('&').map(params => {
        const p = params.split('=')
        return p.length === 2 ? `${p[0]}=${p[1]}&` : ''
      }).join('')
    }
    return (
      <Page {...rest}>
        <ConfirmModal
          title="操作提示"
          name="export"
          message={"确认导出数据？"}
          onCancel={() => this.dispatch(actions.hideModal('export'))}
          onSave={() => window.open(`${baseURL}${url}?${queryParams}download=2&${queryCriteria}`, '_self')}
        />
        {children}
      </Page>
    )
  }
}
).connect(state => {
  const { criteria = {} } = state.page
  var string = momentToString(criteria, 'YYYY-MM-DD');
  let queryCriteria = { ...criteria, ...string }
  queryCriteria = `${Object.keys(queryCriteria).map(key => `${key}=${queryCriteria[key]}`).join('&')}`
  return {
    queryCriteria,
  }
})
