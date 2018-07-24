import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import { CENTER_STATUS } from 'common/config'
import actions from 'system/actions/center'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import { BtnGroup, Btn } from 'common/button-group'
import Status from 'common/page/page-table-status'
import FormModal, { FormModalStatic } from 'common/page/form-modal'
import { Select2 } from 'common/select'
import { IconButton } from 'common/button'
import { Input, DatePicker } from 'antd'
import api from 'common/api'
const { TextArea } = Input


export default (class extends Base {
  columns = [
    {
      title: '中心ID',
      dataIndex: 'campus_id'
    }, {
      title: '中心名称',
      dataIndex: 'name'
    }, {
      title: '授权专业',
      dataIndex: 'major_abbrs'
    }, {
      title: '状态',
      dataIndex: 'status',
      render(data) {
        return <Status config={CENTER_STATUS} value={data.status} />
      }
    }, {
      title: '启动日期',
      dataIndex: 'start_date'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('info', data)) }} >查看</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }}>修改</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('audit', data)) }}>授权</Btn>
          </BtnGroup>
        )
      }
    }
  ]
  filters = [
    { label: '中心ID', name: 'campus_id', render: renderInput },
    { label: '中心名称', name: 'name', render: renderInput },
    { label: '状态', name: 'status', options: CENTER_STATUS, render: renderSelect },
    { label: '启动日期', name: 'range', render: renderRangePicker },
  ]

  buttons = <IconButton size="small" icon="add" onClick={() => { this.dispatch(actions.showModal('add')) }}>新建</IconButton>

  modelFields = [
    {
      condition: () => false,
      field: 'campus_id',
      formItemProps: {
        label: '中心ID'
      },
    },
    {
      field: 'name',
      formItemProps: {
        label: '中心名称'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '姓名不能为空' },
        ],
      },
    },
    {
      field: 'addr',
      formItemProps: {
        label: '中心地址'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '中心地址不能为空' },
        ],
      }
    },
    {
      field: 'leader',
      formItemProps: {
        label: '负责人'
      },
    },
    {
      field: 'tel',
      formItemProps: {
        label: '手机号'
      },
      fieldDecorator: {
        rules: [
          { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' }
        ],
      }
    },
    {
      field: 'start_date',
      formItemProps: {
        label: '启动日期'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '启动日期不能为空' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return <DatePicker />
      }
    },
    {
      condition: () => false,
      field: 'major_names',
      formItemProps: {
        label: '授权专业'
      },
    },
    {
      field: 'status',
      formItemProps: {
        label: '中心状态'
      },
      renderItem() {
        return <Select2 options={CENTER_STATUS} getValue={i => i.value} getLabel={i => i.label} />
      }
    },
    {
      field: 'memo',
      formItemProps: {
        label: '备注'
      },
      renderItem() {
        return <TextArea />
      }
    },
  ]

  infoFields = this.modelFields.map(item => {
    return {
      ...item,
      condition: null,
      fieldDecorator: null,
      render: null,
      renderItem: 'static'
    }
  })

  initState = ({ modalParams }, momentize) => {
    return {
      model: momentize(modalParams, ['start_date'])
    }
  }

  auditModelFields = [
    {
      field: 'major_id',
      formItemProps: {
        label: '专业授权',
      },
      renderItem({ state }) {
        return <Select2 mode="multiple" optionLabelProp="value" options={state.campusList} getValue={i => i.major_id} getLabel={i => `${i.major_id}（${i.name}）`} />
      }
    },
  ]

  initCampus = ({ modalParams }) => api.systemCenterAuditOpts({ campus_id: modalParams.campus_id }).then(campusList => {
    return {
      model: {
        major_id: modalParams.major_ids
      },
      campusList: campusList || []
    }
  })

  render() {
    return (
      <Page
        title="中心列表"
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        buttons={this.buttons}
        selectId={i => i.campus_id}
        exportUrl="/home/campus/admin/campus/export"
      >
        <FormModalStatic
          title="中心信息"
          name="info"
          initState={({ modalParams }) => ({ model: { ...modalParams, status: modalParams.status_label } })}
          modelFields={this.infoFields}
          onCancel={() => this.dispatch(actions.hideModal('info'))}
        />
        <FormModal
          title="修改中心"
          name="edit"
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={(modalParams, { campus_id }) => this.dispatch(actions.edit({ ...modalParams, campus_id }))}
          initState={this.initState}
        />
        <FormModal
          title="新增中心"
          name="add"
          modelFields={this.modelFields.filter(i => i.field !== 'status')}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={(modalParams) => this.dispatch(actions.add({ ...modalParams }))}
        />
        <FormModal
          title="专业授权"
          name="audit"
          modelFields={this.auditModelFields}
          initState={this.initCampus}
          onCancel={() => this.dispatch(actions.hideModal('audit'))}
          onSave={({ major_id }, { campus_id }) => this.dispatch(actions.updateCenterMajor({ campus_id, major_id }))}
        />
      </Page>
    )
  }
}).connect((state) => {
  const visible = state.page.modalVisible
  return {
    visible
  }
})
