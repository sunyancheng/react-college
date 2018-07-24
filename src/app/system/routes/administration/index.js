import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import actions from 'system/actions/dean'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import { BtnGroup, Btn } from 'common/button-group'
import Status from 'common/page/page-table-status'
import { Select2 } from 'common/select'
import { DatePicker, Input } from 'antd'
import FormModal, { FormModalStatic } from 'common/page/form-modal'
import { TEACHER_STATUS } from 'common/config'
import AccountInput from 'common/account-input'
import api from 'common/api'
import { IconButton } from 'common/button'
const TextArea = Input.TextArea

export default (class extends Base {
  columns = [
    {
      title: '教务ID',
      dataIndex: 'user_dean_id'
    }, {
      title: '教务姓名',
      dataIndex: 'name'
    }, {
      title: '所属中心',
      dataIndex: 'campus_ids'
    }, {
      title: '状态',
      dataIndex: 'dean_status',
      render: ({ dean_status: status }) => <Status config={TEACHER_STATUS} value={status} />
    }, {
      title: '入职时间',
      dataIndex: 'entry_time'
    }, {
      title: '操作',
      width: 200,
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('detail', data)) }} >查看</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('campus', data)) }} >中心</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }} >修改</Btn>
          </BtnGroup>
        )
      }
    }

  ]

  filters = [
    { label: '教务ID', name: 'user_dean_id', render: renderInput },
    { label: '教务姓名', name: 'name', render: renderInput },
    { label: '状态', name: 'dean_status', options: TEACHER_STATUS, render: renderSelect },
    { label: '入职日期', name: 'entry_time', render: renderRangePicker },
  ]

  buttons = <IconButton size="small" icon="add" onClick={() => { this.dispatch(actions.showModal('add')) }}>新建</IconButton>

  getModelFields(noDeanStatus, disableAccountInput) {
    return [
      {
        field: 'name',
        formItemProps: {
          label: '教务姓名',
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '教务姓名不能为空' },
          ],
        },
      },
      {
        field: 'mail',
        formItemProps: {
          label: '联系邮箱',
        },
        fieldDecorator: {
          rules: [
            { type: 'email', required: true, message: '请填写正确格式的邮箱' }
          ],
        }
      },
      {
        field: 'entry_time',
        formItemProps: {
          label: '入职日期',
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '入职日期不能为空' }
          ],
          validateTrigger: 'onChange'
        },
        renderItem() {
          return <DatePicker format="YYYY-MM-DD" />
        }
      },
      !noDeanStatus && {
        field: 'dean_status',
        hasPopupContainer: true,
        formItemProps: {
          label: '教务状态',
          rules: [
            { required: true, message: '教务状态不能为空' }
          ],
        },
        renderItem() {
          return <Select2 showSearch options={TEACHER_STATUS} getValue={({ value }) => value} getLabel={({ label }) => label} />
        }
      },
      {
        field: 'account',
        formItemProps: {
          label: '平台账号'
        },
        render({ props, state }) {
          return <AccountInput disabled={disableAccountInput} defaultValue={state.model && state.model.account} form={props.form} />
        }
      },
      {
        field: 'campus_ids',
        condition: () => false,
        formItemProps: {
          label: '所属中心'
        },
      },
      {
        field: 'introduction',
        formItemProps: {
          label: '个人简介'
        },
        fieldDecorator: {
          rules: [
            { pattern: /^[\S\s]{1,400}$/, message: '个人简介不能超过400个字符' }
          ],
        },
        renderItem() {
          return <TextArea rows="5" />
        }
      }
    ].filter(i => i)
  }

  detailFields = this.getModelFields().map(item => ({
    ...item,
    render: null,
    fieldDecorator: null,
    renderItem: 'static'
  }))

  campusModelFields = [
    {
      field: 'campus_ids',
      formItemProps: {
        label: '关联中心',
      },
      renderItem({ state }) {
        return <Select2 mode="multiple" optionLabelProp="value" options={state.campusList} getValue={i => i.campus_id} getLabel={i => `${i.campus_id} （${i.name}）`} />
      }
    },
  ]

  initViewState = ({ modalParams }) => ({ model: { ...modalParams, dean_status: modalParams.dean_status_label } })

  initEditState = async ({ modalParams }, momentize) => {
    const model = await api.systemDeanDetail({ user_dean_id: modalParams.user_dean_id })
    return {
      model: momentize(model, ['entry_time'])
    }
  }

  initCampus = ({ modalParams }) => api.systemCenterList().then(campusList => {
    return {
      model: {
        campus_ids: (modalParams.campus_ids || '').split(';').filter(item => item),
      },
      campusList: campusList.list || []
    }
  })


  onAddValidSubmit = (criteria) => {
    this.dispatch(actions.add({ ...criteria }))
  }

  onEditValidSubmit = (criteria, modalParams) => {
    let { user_dean_id, user_id } = modalParams
    this.dispatch(actions.edit({ ...criteria, user_dean_id, user_id }))
  }

  render() {
    return (
      <Page
        title="教务列表"
        buttons={this.buttons}
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        selectId={i => i.user_dean_id}
        exportUrl="/home/user/admin/dean/export"
      >
        <FormModal
          name="add"
          title="新建教务"
          modelFields={this.getModelFields(true)}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={this.onAddValidSubmit}
        />
        <FormModalStatic
          name="detail"
          title="查看教务"
          initState={this.initViewState}
          modelFields={this.detailFields}
          onCancel={() => this.dispatch(actions.hideModal('detail'))}
        />
        <FormModal
          name="edit"
          title="编辑教务"
          initState={this.initEditState}
          modelFields={this.getModelFields(false, true)}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={this.onEditValidSubmit}
        />
        <FormModal
          title="关联中心"
          name="campus"
          modelFields={this.campusModelFields}
          initState={this.initCampus}
          onCancel={() => this.dispatch(actions.hideModal('campus'))}
          onSave={({ campus_ids }, { user_dean_id }) => this.dispatch(actions.assignCampus({ user_dean_id, campus_ids: campus_ids.join(',') }))}
        />
      </Page>
    )
  }
}).connect(() => ({}))
