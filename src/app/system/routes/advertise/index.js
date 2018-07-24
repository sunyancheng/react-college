import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import actions from 'system/actions/advertise'
import { renderInput, renderSelect, renderRangePicker } from 'common/page/page-filter/filter'
import { BtnGroup, Btn } from 'common/button-group'
import { ADVERTISE_STATUS, ADVERTISE_TYPE } from 'common/config'
import Status from 'common/page/page-table-status'
import { IconButton } from 'common/button'
import FormModal from 'common/page/form-modal'
import { Select2 } from 'common/select'
import { DatePicker } from 'antd'
import PictureWall from 'common/pic-wall'
import ConfirmModal from 'common/page/confirm-modal'
import api from 'common/api'
import moment from 'moment'


export default (class extends Base {
  columns = [
    {
      title: '广告ID',
      dataIndex: 'ad_id'
    }, {
      title: '广告标题',
      dataIndex: 'title'
    }, {
      title: '广告类型',
      dataIndex: 'ad_type_label'
    }, {
      title: '状态',
      dataIndex: 'status',
      render(item) {
        return <Status config={ADVERTISE_STATUS} value={item.status} />
      }
    }, {
      title: '发布时间',
      dataIndex: 'start_time'
    }, {
      title: '截止时间',
      dataIndex: 'end_time'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }} >编辑</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('delete', data)) }} >删除</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  filters = [
    { label: '广告ID', name: 'activity_id', render: renderInput },
    { label: '广告标题', name: 'title', render: renderInput },
    { label: '广告类型', name: 'ad_type', options: ADVERTISE_TYPE, render: renderSelect },
    { label: '日期范围', name: 'range', render: renderRangePicker },
    { label: '活动状态', name: 'status', options: ADVERTISE_STATUS, render: renderSelect },
  ]

  buttons = <IconButton size="small" icon="add" onClick={() => { this.dispatch(actions.showModal('add')) }}>添加</IconButton>

  modelFields = [
    {
      field: 'title',
      formItemProps: {
        label: '广告标题',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '广告标题不能为空' },
        ],
      }
    }, {
      field: 'image',
      formItemProps: {
        label: '广告图片'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '广告图片不能为空' },
        ]
      },
      renderItem() {
        return <PictureWall max={1} />
      }
    }, {
      field: 'ad_type_id',
      formItemProps: {
        label: '广告类型'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '广告类型不能为空' },
        ]
      },
      renderItem({ state: { type_option } }) {
        return <Select2 options={type_option} getValue={({ ad_type_id }) => ad_type_id} getLabel={({ name }) => name} />
      }
    }, {
      field: 'url',
      formItemProps: {
        label: '广告链接'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '广告链接不能为空' },
        ]
      }
    }, {
      field: 'start_bgcolor',
      formItemProps: {
        label: '起始背景颜色'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '起始颜色不能为空' },
          { pattern: /^#[0-9A-Za-z]{6}$/, message: '请按照正确格式填写颜色，如：#DDDDDD， #735269' },
        ]
      }
    }, {
      field: 'end_bgcolor',
      formItemProps: {
        label: '截止背景颜色'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '截止颜色不能为空' },
          { pattern: /^#[0-9A-Za-z]{6}$/, message: '请按照正确格式填写颜色，如：#DDDDDD， #735269' },
        ]
      }
    }, {
      field: 'status',
      formItemProps: {
        label: '广告状态'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '广告状态不能为空' },
        ]
      },
      renderItem() {
        return <Select2 options={ADVERTISE_STATUS} getValue={({ value }) => value} getLabel={({ label }) => label} />
      }
    }, {
      field: 'start_time',
      formItemProps: {
        label: '发布时间'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '发布时间不能为空' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return <DatePicker />
      }
    }, {
      field: 'end_time',
      formItemProps: {
        label: '截止时间'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '截止时间不能为空' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return <DatePicker />
      }
    }
  ]

  addInitState = async () => {
    const type_option = await api.advertiseTypeList()
    return {
      model: { status: '1', start_time: moment() },
      type_option
    }
  }

  editInitState = async ({ modalParams }, momentize) => {
    const { ad_id } = modalParams
    const [model, type_option] = await Promise.all([
      api.advertiseDetail({ ad_id }),
      api.advertiseTypeList()
    ])
    model.image = [model.image]
    return {
      model: momentize(model, ['start_time', 'end_time']),
      type_option
    }
  }

  formatModelData(values) { return values }

  render() {
    return (
      <Page
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        buttons={this.buttons}
        selectId={i => i.ad_id}
        exportUrl="/misc/ad/admin/ad/export"
      >
        <FormModal
          title="添加广告"
          name="add"
          initState={this.addInitState}
          modelFields={this.modelFields}
          dateFormat="YYYY-MM-DD HH:mm:ss"
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={data => this.dispatch(actions.add(this.formatModelData(data)))}
        />
        <FormModal
          title="添加广告"
          name="edit"
          initState={this.editInitState}
          modelFields={this.modelFields}
          dateFormat="YYYY-MM-DD HH:mm:ss"
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={(value, { ad_id }) => this.dispatch(actions.edit({ ...value, ad_id }))}
        />
        <ConfirmModal
          title="操作提示"
          name="delete"
          message={"确认是否删除?"}
          onCancel={() => this.dispatch(actions.hideModal('delete'))}
          onSave={({ ad_id }) => this.dispatch(actions.delete({ ad_id }))}
        />
      </Page>
    )
  }
}).connect(() => ({}))
