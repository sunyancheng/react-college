import React from 'react'
import Base from 'common/base'
import FormModal from 'common/page/form-modal'
import { NOTICE_TYPE } from 'common/config'
import { api } from 'common/api'
import Cell from 'common/cell'
import './style.less'
import Breadcrumb from 'common/breadcrumb'

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
      renderItem({ state }) {
        return <span>{state.model.title}</span>
      }
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
      renderItem({ state }) {
        return <span>{state.model.ctime}</span>
      }
    }, {
      field: 'campus_name',
      responsive: { span: 24 },
      formItemProps: {
        label: '发布中心',
        labelCol: { span: 3 },
        wrapperCol: { span: 10 }
      },
      renderItem({ state }) {
        return <span>{state.model.campus_name}</span>
      }
    }, {
      field: 'use_user',
      responsive: { span: 24 },
      formItemProps: {
        label: '公告范围',
        labelCol: { span: 3 },
        wrapperCol: { span: 10 }
      },
      renderItem: ({ state }) => {
        const { flat, list } = state
        const use_user = state.model.use_user || []
        const listMap = {}
        use_user.forEach(v => listMap[v.user] = v)
        return (
          <Cell style={{ maxHeight: '300px', overflow: 'auto' }}><div>
            {
              use_user.map((v, i) => {
                return (
                  <div className="notice-use_user" key={i}>
                    <div>{list.find(item => item.user == v.user).name}</div>
                    {listMap[v.user].list && listMap[v.user].list.map((v, i) => <div className="notice-indent" key={i}>{(flat.find(item => item.campus_id == v) || {}).name}</div>)}
                  </div>
                )
              })
            }
          </div></Cell>)
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
    let detail = await api.systemNoticeListDetail({ notice_id })
    if (detail) detail.use_user = JSON.parse(detail.use_user || '{}')
    const list = await api.systemNoticeGetUserList() || []
    const flat = list.reduce((ret, item) => { return item.list ? ret.concat(item.list) : ret }, [])
    return {
      model: detail,
      flat,
      list
    }
  }

  goBack = () => this.props.history.push('/notice')

  render() {
    return (
      <FormModal
        isPage
        title={<Breadcrumb />}
        onCancel={this.goBack}
        initState={this.initState}
        modelFields={this.checkModelFields}
      />
    )
  }
}).connect(() => ({})).withRouter()
