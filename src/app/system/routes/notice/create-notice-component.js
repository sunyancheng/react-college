import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-breadcrumb'
import Status from 'common/page/page-table-status'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import './style.less'
import { BtnGroup, Btn } from 'common/button-group'
import { IconButton } from 'common/button'
import { NOTICE_CONFIG_STATUS, NOTICE_TYPE } from 'common/config'
import ConfirmModal from 'common/page/confirm-modal'
import Tooltip from 'common/tooltip'

export default function ({ actions, isDelete = false, checkPath, addPath, editPath }) {
  return (class extends Base {
    columns = [
      {
        title: '公告ID',
        dataIndex: 'notice_id'
      }, {
        title: '公告标题',
        dataIndex: 'title',
        render({ title }) {
          return <Tooltip title={title} />
        }
      }, {
        title: '发布中心',
        dataIndex: 'campus_name',
        render({ campus_name }) {
          return <Tooltip title={campus_name} />
        }
      }, {
        title: '类型',
        dataIndex: 'type',
        render({ type }) {
          return (NOTICE_TYPE.find(item => item.value === type) || {}).label
        }
      }, {
        title: '状态',
        dataIndex: 'status',
        render(item) {
          return <Status config={NOTICE_CONFIG_STATUS} value={item.status} />
        }
      }, {
        title: '日期',
        dataIndex: 'up_time',
        render: (item) => item.status == 1 ? item.pub_time : item.ctime
      }, {
        title: '操作',
        dataIndex: 'operation',
        render: (data) => {
          return (
            <BtnGroup>
              {
                data.status == 1 ? (<Btn onClick={() => this.props.history.push(checkPath(data.notice_id))}>查看</Btn>) : (<Btn onClick={() => this.props.history.push(editPath(data.notice_id))}>修改</Btn>)
              }
              {isDelete && <Btn type="danger" onClick={() => { this.dispatch(actions.showModal('delete', data)) }} >删除</Btn>}
            </BtnGroup>
          )
        }
      }
    ]

    getFilters = () => ([
      { label: '公告标题', name: 'title', render: renderInput },
      { label: '状态', name: 'status', options: NOTICE_CONFIG_STATUS, placeholder: '请选择', render: renderSelect },
      { label: '日期', name: 'range', render: renderRangePicker },
    ])

    buttons = <IconButton size="small" icon="add" onClick={() => this.props.history.push(`${addPath}`)}>新建</IconButton>

    render() {
      let filters = this.getFilters();
      return (
        <Page
          title="公告列表"
          actions={actions}
          filters={filters}
          columns={this.columns}
          buttons={this.buttons}
          selectId={i => i.notice_id}
        >
          {isDelete && (
            <ConfirmModal
              title="操作提示"
              name="delete"
              message={"删除后，文件数据将不可恢复，请确认操作！"}
              onCancel={() => this.dispatch(actions.hideModal('delete'))}
              onSave={({ notice_id }) => this.dispatch(actions.delete({ notice_id }))}
            />)}
        </Page>
      )
    }
  }
  ).connect((state) => {
    let { campusList = [] } = state.page;
    return {
      campusList: [{ campus_id: '1', name: '北京总部' }, ...campusList]
    }
  })
}
