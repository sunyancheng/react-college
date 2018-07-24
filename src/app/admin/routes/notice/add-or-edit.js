import React from 'react'
import Base from 'common/base'
import FormModal from 'common/page/form-modal'
import { NOTICE_TYPE, ADMIN_NOTICE_TYPE } from 'common/config'
import { Select2 } from 'common/select'
import { api } from 'admin/api'
import { Input } from 'antd'
import './style.less'
import Cell from 'common/cell'
import BraftEditor from 'common/braft-editor'
import actions from 'admin/actions/notice'
import BreadCrumb from 'common/breadcrumb'

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
      },
      renderItem() {
        return <Select2 mode="multiple" options={ADMIN_NOTICE_TYPE} getValue={i => i.value} getLabel={i => i.label} />
      }
    }, {
      field: 'content',
      responsive: { span: 24 },
      formItemProps: {
        label: '公告内容',
        labelCol: { span: 3 },
        wrapperCol: { span: 20 }
      },
      renderItem: () => {
        return <Cell><BraftEditor/></Cell>
      }
    }
  ]

  initState = async () => {
    const { notice_id } = this.props.match.params
    let detail = notice_id ? await api.adminNoticeListDetail({ notice_id }) : null
    if(detail && detail.use_user) detail.use_user = detail.use_user.split(',')
    return {
      model: detail
    }
  }

  handleSave = (value, status) => {
    const { notice_id } = this.props.match.params
    if (notice_id) {
      api.adminNoticeUpdate({ ...value, use_user: value.use_user.join(','), notice_id, status })
      .then(() => this.dispatch(actions.setMessageNumber()))
      .then(() => this.goBack())
      return
    }
    api.adminNoticeAdd({ ...value, use_user: value.use_user.join(','), status })
    .then(() => this.dispatch(actions.setMessageNumber()))
    .then(() => this.goBack())
  }

  goBack = () => this.props.history.push('/notice')

  render() {
    return (
      <FormModal
        isPage
        title={<BreadCrumb />}
        onSave={(value) => this.handleSave(value, 1)}
        onCancel={this.goBack}
        initState={this.initState}
        modelFields={this.modelFields}
        okText="立即发布"
        extraText="保存"
        extraBtn={(value) => this.handleSave(value, 2)}
      />
    )
  }
}).connect(() => ({})).withRouter()
