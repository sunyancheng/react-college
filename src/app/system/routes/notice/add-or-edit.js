import React from 'react'
import Base from 'common/base'
import FormModal from 'common/page/form-modal'
import { NOTICE_TYPE } from 'common/config'
import { Select2 } from 'common/select'
import Tree from './tree'
import { api } from 'common/api'
import { Input } from 'antd'
import './style.less'
import Cell from 'common/cell'
import BraftEditor from 'common/braft-editor'
import Breadcrumb from 'common/breadcrumb'

export default (class extends Base {
  modelFields = [
    {
      field: 'title',
      responsive: { span: 24 },
      formItemProps: {
        label: '公告标题',
        labelCol: { span: 3 },
        wrapperCol: { span: 10 }
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '公告标题不能为空' },
        ],
      },
      renderItem() {
        return <Input />
      }
    }, {
      field: 'type',
      responsive: { span: 24 },
      formItemProps: {
        label: '公告类型',
        labelCol: { span: 3 },
        wrapperCol: { span: 5 }
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '公告类型不能为空' },
        ],
      },
      renderItem() {
        return <Select2 options={NOTICE_TYPE} getValue={i => i.value} getLabel={i => i.label} />
      }
    }, {
      field: 'use_user',
      responsive: { span: 24 },
      formItemProps: {
        label: '公告范围',
        labelCol: { span: 3 },
        wrapperCol: { span: 5 }
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '公告范围不能为空' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem({ state }) {
        return <Cell style={{ height: '300px', maxHeight: '300px', overflow: 'auto' }}><Tree options={state.list} /></Cell>
      }
    }, {
      field: 'content',
      responsive: { span: 24 },
      formItemProps: {
        label: '公告内容',
        labelCol: { span: 3 },
        wrapperCol: { span: 20 }
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '公告内容不能为空' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem: () => {
        return <Cell style={{ width: 1200 }}><BraftEditor /></Cell>
      }
    }
  ]

  initState = async () => {
    const { notice_id } = this.props.match.params
    let detail = notice_id ? await api.systemNoticeListDetail({ notice_id }) : null
    if (detail) detail.use_user = JSON.parse(detail.use_user || '{}')
    const list = await api.systemNoticeGetUserList()
    return {
      model: detail,
      list
    }
  }

  handleSave = (value, status) => {
    const { notice_id } = this.props.match.params
    if (notice_id) {
      api.systemNoticeUpdate({ ...value, use_user: JSON.stringify(value.use_user), notice_id, status }).then(() => this.goBack())
      return
    }
    api.systemNoticeCreate({ ...value, use_user: JSON.stringify(value.use_user), status }).then(() => this.goBack())
  }

  goBack = () => this.props.history.push('/notice')

  render() {
    return (
      <FormModal
        isPage
        title={<Breadcrumb />}
        onSave={(value) => this.handleSave(value, 1)}
        onCancel={this.goBack}
        okText="立即发布"
        extraText="保存"
        initState={this.initState}
        modelFields={this.modelFields}
        extraBtn={(value) => this.handleSave(value, 2)}
      />
    )
  }
}).connect(() => ({})).withRouter()
