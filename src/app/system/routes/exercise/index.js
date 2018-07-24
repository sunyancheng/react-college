import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import actions from 'system/actions/exercise'
import { renderInput } from 'common/page/page-filter/filter'
import Status from 'common/page/page-table-status'
import FormModal from 'common/page/form-modal'
import ConfirmModal from 'common/page/confirm-modal'
import { EXERCISE_STATUS } from 'common/config'
import { IconButton } from 'common/button'
import { Input } from 'antd'
import { BtnGroup, Btn } from 'common/button-group'
import { RadioGroup2 } from 'common/radio-group'
import { Select2 } from 'common/select'
import { api } from 'common/api'
import Tooltip from 'common/tooltip'

export default (class extends Base {
  columns = [
    {
      title: '练习ID',
      dataIndex: 'exam_id'
    }, {
      title: '练习名称',
      dataIndex: 'name',
      render({ name }) {
        return <Tooltip title={name} />
      }
    }, {
      title: '试题数',
      dataIndex: 'total'
    }, {
      title: '总分',
      dataIndex: 'total_score'
    }, {
      title: '是否可用',
      dataIndex: 'status',
      render(item) {
        return <Status config={EXERCISE_STATUS} value={item.status} />
      }
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }} >修改</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('delete', data)) }} >删除</Btn>
          </BtnGroup>
        )
      }
    }
  ]
  filters = [
    { label: '练习编号', name: 'exam_id', render: renderInput },
    { label: '练习名称', name: 'name', render: renderInput },
  ]

  modelFields = [
    {
      field: 'name',
      formItemProps: {
        label: '练习名称',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '练习名称不能为空' },
        ],
      },
      renderItem() {
        return (<Input placeholder="请输入练习名称" />)
      }
    }, {
      field: 'score',
      formItemProps: {
        label: '每题分值',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '每题分值不能为空' },
        ],
      },
      renderItem() {
        return (<Input placeholder="请输入每题分值" />)
      }
    }, {
      field: 'exam_pool_ids',
      hasPopupContainer: true,
      formItemProps: {
        label: '试题ID',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '试题ID不能为空' },
        ],
      },
      renderItem({ state }) {
        return (<Select2 optionLabelProp={'value'} mode="multiple" options={state.options} getValue={i => i.exam_pool_id} getLabel={i => `${i.exam_pool_id}（${i.title}）`} />)
      }
    }
  ]

  editModalFields = this.modelFields.concat({
    field: 'status',
    formItemProps: {
      label: '练习状态',
    },
    fieldDecorator: {
      rules: [
        { required: true, message: '练习状态不能为空' },
      ],
      validateTrigger: 'onChange'
    },
    renderItem() {
      return <RadioGroup2 showSearch options={EXERCISE_STATUS} getValue={({ value }) => value} getLabel={({ label }) => label} />
    }
  })

  addMenu = () => this.dispatch(actions.showModal('add'))

  buttons = <IconButton size="small" icon="add" onClick={() => this.addMenu()}>添加</IconButton>

  initState = async ({ modalParams, name }) => {
    var detail
    if (name === 'edit') {
      detail = await api.systemExerciseGetOne({ exam_id: modalParams.exam_id })
      detail.exam_pool_ids = detail.exam_pool_ids ? detail.exam_pool_ids.split(';') : []
    }
    if (name === 'add') {
      detail = { score: '10' }
    }
    const options = await api.systemExamGetAll()
    return {
      model: detail,
      options
    }
  }

  render() {
    return (
      <Page
        title="练习列表"
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        buttons={this.buttons}
        selectId={i => i.exam_id}
        exportUrl="/core/resource/admin/exam/export"
      >
        <FormModal
          title="添加练习"
          name="add"
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={(values) => this.dispatch(actions.add({ ...values, exam_pool_ids: values.exam_pool_ids ? values.exam_pool_ids.join(';') : '' }))}
          initState={this.initState}
        />
        <FormModal
          title="修改练习"
          name="edit"
          modelFields={this.editModalFields}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={(values, { exam_id }) => this.dispatch(actions.edit({ ...values, exam_id, exam_pool_ids: values.exam_pool_ids ? values.exam_pool_ids.join(';') : '' }))}
          initState={this.initState}
        />
        <ConfirmModal
          title="操作提示"
          name="delete"
          message={"删除后，记录将不可恢复，请确认操作！"}
          onCancel={() => this.dispatch(actions.hideModal('delete'))}
          onSave={({ exam_id }) => this.dispatch(actions.delete({ exam_id }))}
        />
      </Page>
    )
  }
}).connect(() => ({}))
