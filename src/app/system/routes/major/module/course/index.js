import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-breadcrumb'
import actions from 'system/actions/course-module-course'
import { IconButton } from 'common/button'
import FormModal from 'common/page/form-modal'
import ConfirmModal from 'common/page/confirm-modal'
import { BtnGroup, Btn } from 'common/button-group'
import { Select2 } from 'common/select'
import api from 'common/api'
import Status from 'common/page/page-table-status'
import { MODULE_COURSE, YES_OR_NO, COURSE_SWITCH_STATUS } from 'common/config'
import { RadioGroup2 } from 'common/radio-group'

export default (class extends Base {
  columns = [
    {
      title: '序号',
      dataIndex: 'sort'
    }, {
      title: '课程ID',
      dataIndex: 'course_id'
    }, {
      title: '课程名称',
      dataIndex: 'course_name'
    }, {
      title: '有无挡板',
      dataIndex: 'switch',
      render(data) {
        return <Status config={COURSE_SWITCH_STATUS} value={data.switch} />
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      render(data) {
        return <Status config={MODULE_COURSE} value={data.status} />
      }
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }} >修改</Btn>
            <Btn type="danger" onClick={() => { this.dispatch(actions.showModal('delete', data)) }} >删除</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  modelFields = [
    {
      field: 'sort',
      formItemProps: {
        label: '课程序号'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '模块序号不能为空' },
          { pattern: /^[0-9]\d*$/, message: '序号格式不正确' }
        ],
      }
    }, {
      field: 'course_id',
      formItemProps: {
        label: '课程ID'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '课程ID不能为空' },
        ]
      },
      renderItem({ state }) {
        return (<Select2 options={state.list} getValue={i => i.value} getLabel={i => `${i.label}（${i.value}）`} />)
      }
    }, {
      field: 'switch',
      formItemProps: {
        label: '设置挡板'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '挡板状态必须设置' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return (<RadioGroup2 options={YES_OR_NO} getValue={i => i.value} getLabel={i => i.label} />)
      }
    }
  ]

  addMenu = () => this.dispatch(actions.showModal('add', { module_id: this.props.match.params.module_id }))

  editInitState = async ({ modalParams }) => {
    const list = await api.getModuleList()
    return {
      model: modalParams,
      list: list.map(item => ({ label: item.name, value: item.course_id }))
    }
  }

  addInitState = async () => {
    const list = await api.getModuleList()

    return {
      model: { switch: '2' },
      list: list.map(item => ({ label: item.name, value: item.course_id }))
    }
  }

  buttons = <IconButton size="small" icon="add" onClick={() => this.addMenu()}>添加</IconButton>

  render() {
    return (
      <Page
        actions={actions}
        columns={this.columns}
        buttons={this.buttons}
        initState={{ criteria: { module_id: this.props.match.params.module_id } }}
        selectId={i => i.course_id}
      >
        <FormModal
          title="添加课程"
          name="add"
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={(value, { module_id }) => this.dispatch(actions.add({ ...value, module_id, status: 1, disableReset: true }))}
          initState={this.addInitState}
        />
        <FormModal
          title="调整课程"
          name="edit"
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={(value, { module_course_map_id: module_course_id }) => this.dispatch(actions.edit({ ...value, module_course_id, status: 1, disableReset: true }))}
          initState={this.editInitState}
        />
        <ConfirmModal
          title="操作提示"
          name="delete"
          message={"删除后，记录将不可恢复，请确认操作！"}
          onCancel={() => this.dispatch(actions.hideModal('delete'))}
          onSave={({ module_course_map_id: module_course_id }) => this.dispatch(actions.delete({ module_course_id, disableReset: true }))}
        />
      </Page>
    )
  }
}).connect(() => ({}))
