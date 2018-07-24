import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import actions from 'system/actions/invitied-user'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import Status from 'common/page/page-table-status'
import { INVITIED_USER_TYPE } from 'common/config'
import Tooltip from 'common/tooltip'

export default (class extends Base {
  columns = [
    {
      title: '被邀请用户ID',
      dataIndex: 'user_id'
    }, {
      title: '用户身份',
      dataIndex: 'type',
      render(item) {
        return <Status config={INVITIED_USER_TYPE} value={item.type} />
      }
    }, {
      title: '邀请码',
      dataIndex: 'invitation_code'
    }, {
      title: '邀请人',
      dataIndex: 'name',
      render({ name }) {
        return <Tooltip title={name} />
      }
    }, {
      title: '邀请时间',
      dataIndex: 'ctime'
    }
  ]
  filters = [
    { label: '邀请码', name: 'invitation_code', render: renderInput },
    { label: '用户ID', name: 'user_id', render: renderInput },
    { label: '身份', name: 'type', options: INVITIED_USER_TYPE, render: renderSelect },
    { label: '邀请日期', name: 'range', render: renderRangePicker }
  ]

  render() {

    return (
      <Page
        title="邀请列表"
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        buttons={this.buttons}
        selectId={i => i.user_id}
        exportUrl="/misc/invitation/admin/invitation/export"
      />
    )
  }
}).connect(() => ({}))
