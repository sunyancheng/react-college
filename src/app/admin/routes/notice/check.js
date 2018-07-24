import React from 'react'
import Base from 'common/base'
import FormModal from 'common/page/form-modal'
import { NOTICE_TYPE } from 'common/config'
import { api } from 'admin/api'
import Cell from 'common/cell'
import { ADMIN_NOTICE_TYPE } from 'common/config'
import './style.less'
import BreadCrumb from 'common/breadcrumb'

export default (class extends Base {

  checkModelFields = [
    {
      field: 'title',
      responsive: { span: 24 },
      formItemProps: {
        label: '公告标题',
        labelCol: { span: 3 },
        wrapperCol: { span: 10 }
      },
      renderItem: 'static'
    }, {
      field: 'type',
      responsive: { span: 24 },
      formItemProps: {
        label: '公告类型',
        labelCol: { span: 3 },
        wrapperCol: { span: 10 }
      },
      renderItem({ state }) {
        return <span>{NOTICE_TYPE.find(config => config.value == state.model.type).label}</span>
      }
    }, {
      field: 'ctime',
      responsive: { span: 24 },
      formItemProps: {
        label: '公告时间',
        labelCol: { span: 3 },
        wrapperCol: { span: 10 }
      },
      renderItem: 'static'
    }, {
      field: 'use_user',
      responsive: { span: 24 },
      formItemProps: {
        label: '公告范围',
        labelCol: { span: 3 },
        wrapperCol: { span: 10 }
      },
      renderItem({ state }) {
        const { use_user } = state.model
        return (
          <Cell>
            <div style={{minHeight: '100px'}}>
              {use_user && use_user.map((v,i) => <div key={i}>{ADMIN_NOTICE_TYPE.find(c => c.value == v).label}</div>)}
            </div>
          </Cell>)
      }
    }, {
      field: 'content',
      responsive: { span: 24 },
      formItemProps: {
        label: '公告内容',
        labelCol: { span: 3 },
        wrapperCol: { span: 10 }
      },
      renderItem({ state }) {
        return <div className="notice-markdown" dangerouslySetInnerHTML={{ __html: state.model.content }} />
      }
    }
  ]

  initState = async () => {
    const { notice_id } = this.props.match.params
    let detail = await api.adminNoticeListDetail({ notice_id })
    if (detail && detail.use_user) detail.use_user = detail.use_user.split(',')
    return {
      model: detail
    }
  }

  goBack = () => this.props.history.push('/notice')

  render() {
    return (
      <FormModal
        isPage
        title={<BreadCrumb />}
        onCancel={this.goBack}
        initState={this.initState}
        modelFields={this.checkModelFields}
      />
    )
  }
}).connect(() => ({})).withRouter()
