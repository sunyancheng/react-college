import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import actions from 'system/actions/experiment';
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import { BtnGroup, Btn } from 'common/button-group'
import Status from 'common/page/page-table-status'
import { Select2 } from 'common/select'
import { Input, Form } from 'antd';
import Tooltip from 'common/tooltip'
import FormModal from 'common/page/form-modal';
import { EXPERIMENT_STATUS, EXPERIMENT_LEVEL } from 'common/config';
import Uploader from 'common/uploader'
import api from 'common/api';
import ConfirmModal from 'common/page/confirm-modal'
import { IconButton } from 'common/button'
import { RadioGroup2 } from 'common/radio-group'

const TextArea = Input.TextArea;

const timeValidator = (rule, value, callback) => {
  const failed = info => {
    callback(info)
  }
  const success = () => {
    callback()
  }
  if (value > 200 || value < 15) return failed('实验时长应为15-200分钟')
  if (!/^\d+$/.test(value)) return failed('实验时长应为15-200（分钟）之间的整数')
  return success()
}

export default (class extends Base {
  columns = [
    {
      title: '实验ID',
      dataIndex: 'experiment_id',
    }, {
      title: '实验名称',
      dataIndex: 'name',
      render({ name }) {
        return <Tooltip title={name} />
      }
    }, {
      title: '实验老师',
      dataIndex: 'teacher',
    }, {
      title: '项目',
      dataIndex: 'project_name'
    }, {
      title: '实验难度',
      dataIndex: 'level',
      render({ level }) {
        return (EXPERIMENT_LEVEL.find(item => item.value === level) || {}).label
      }
    }, {
      title: '时长（分钟）',
      dataIndex: 'mins'
    }, {
      title: '状态',
      dataIndex: 'status',
      render: ({ status }) => <Status config={EXPERIMENT_STATUS} value={status} />
    }, {
      title: '创建时间',
      dataIndex: 'ctime',
    }, {
      title: '操作',
      width: 240,
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }} >修改</Btn>
            <Btn onClick={() => { this.props.history.push(`/experiment/topo/${data.experiment_id}`) }}>拓扑</Btn>
            <Btn onClick={() => { this.props.history.push(`/experiment/test/${data.experiment_id}`) }} >测试</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('delete', data)) }} >删除</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  filters = [
    { label: '实验ID', name: 'experiment_id', render: renderInput },
    { label: '实验名称', name: 'name', render: renderInput },
    { label: '状态', name: 'status', options: EXPERIMENT_STATUS, render: renderSelect },
    { label: '创建日期', name: 'ctime', render: renderRangePicker },
  ]

  buttons = <IconButton size="small" icon="add" onClick={() => { this.dispatch(actions.showModal('add')) }}>新建</IconButton>

  modelFields = (isEdit) => [
    {
      field: 'name',
      formItemProps: {
        label: '实验名称',
      },

      fieldDecorator: {
        rules: [
          { required: true, message: '实验名称不能为空' },
        ],
      },
    },
    {
      field: 'teacher',
      formItemProps: {
        label: '实验老师',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '实验老师不能为空' },
        ],
      }
    },
    {
      field: 'project_id',
      formItemProps: {
        label: '项目名称'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '项目名称不能为空' }
        ]
      },
      renderItem({ state }) {
        return <Select2 showSearch options={state.model.projects} getValue={({ id }) => id} getLabel={({ name }) => name} />
      }
    },
    {
      field: 'mins',
      formItemProps: {
        label: '实验时长',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '实验时长不能为空' },
          { validator: timeValidator }
        ]
      },
      renderItem() {
        return <Input placeholder="时长（15-200分钟）" />
      }
    },
    isEdit ? this.editUploaderField() : this.newUploaderField(),
    {
      field: 'result',
      formItemProps: {
        label: '实验结果',
      },
      renderItem() {
        return <TextArea rows="5" placeholder="（若有）请输入" />;
      }
    },
    {
      field: 'level',
      formItemProps: {
        label: '实验难度',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '实验难度不能为空' },
          { pattern: /^(?!0+$)\d+$/, message: '请以正整数格式填写实验时间' }
        ],
      },
      renderItem() {
        return <Select2 showSearch options={EXPERIMENT_LEVEL} getValue={({ value }) => value} getLabel={({ label }) => label} />
      }
    },
  ]

  newUploaderField = () => ({
    render({ props, dispatch }) {
      return <Form.Item label="实验指导" labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
        {props.form.getFieldDecorator('paper', { rules: [{ required: true, message: '实验指导不能为空' }], initialValue: props.modalParams && props.modalParams.paper ? { fname: props.modalParams && props.modalParams.paper } : '' })(
          <Uploader
            accept=".pdf"
            type="add"
            onLoading={(loading) => dispatch(actions.modalLoading(loading))}
            isValid={({ fname, type }) => api.isFileExist({ fname, type })}
            fileType={3}
          />
        )}
      </Form.Item>
    }
  })

  editUploaderField = () => ({
    render({ props, dispatch, state }) {
      const { experiment_id } = state.model
      return <Form.Item label="实验指导" labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
        {props.form.getFieldDecorator('paper', { rules: [{ required: true, message: '实验指导不能为空' }], initialValue: props.modalParams && props.modalParams.paper ? { fname: props.modalParams && props.modalParams.paper } : '' })(
          <Uploader
            accept=".pdf"
            type="edit"
            onLoading={(loading) => dispatch(actions.modalLoading(loading))}
            isValid={({ fname }) => api.systemExprimentUpdateFileExists({ fname, experiment_id })}
            fileType={3}
          />
        )}
      </Form.Item>
    }
  })

  editFields = this.modelFields(true).concat([
    {
      field: 'experiment_id',
      render: ({ props, state }) => props.form.getFieldDecorator('experiment_id', { initialValue: state.model.experiment_id })(<div />)
    },
    {
      field: 'status',
      formItemProps: {
        label: '实验状态',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '实验难度不能为空' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return <RadioGroup2 options={EXPERIMENT_STATUS} getValue={({ value }) => value} getLabel={({ label }) => label} />
      }
    },
  ]);

  initState = async ({ name, modalParams }) => {
    const { projects } = await api.systemTargetGetSelect()
    var model = {};
    if (name === 'edit') {
      model = modalParams
    }
    return {
      model: { ...model, projects }
    }
  }

  initCampus = async ({ modalParams }) => {
    let campusList = await api.systemCenterList();
    return {
      model: {
        campus_ids: modalParams.campus_ids.split(';'),
      },
      campusList: (campusList.list || []).map(({ name: label, campus_id: value }) => ({ label, value }))
    };
  }

  onAddValidSubmit = (criteria) => {
    this.dispatch(actions.add({ ...criteria, paper: criteria.paper.fname }));
  }

  onEditValidSubmit = (criteria) => {
    this.dispatch(actions.edit({ ...criteria, paper: criteria.paper.fname }));
  }

  render() {
    return (
      <Page
        title="实验列表"
        buttons={this.buttons}
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        selectId={i => i.experiment_id}
        exportUrl="/core/resource/admin/experiment/export"
      >
        <FormModal
          name="add"
          title="创建实验"
          initState={this.initState}
          modelFields={this.modelFields()}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={this.onAddValidSubmit}
        />
        <FormModal
          name="edit"
          title="编辑实验"
          initState={this.initState}
          modelFields={this.editFields}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={this.onEditValidSubmit}
        />
        <ConfirmModal
          title="操作提示"
          name="delete"
          message={"确认是否删除?"}
          onCancel={() => this.dispatch(actions.hideModal('delete'))}
          onSave={({ experiment_id }) => this.dispatch(actions.delete({ experiment_id }))}
        />
      </Page>
    )
  }
}).connect(() => ({}))
