import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import { LECTURE_COMFIG_STATUS } from 'common/config'
import actions from 'system/actions/resource-lecture'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import { BtnGroup, Btn } from 'common/button-group'
import { renderLectureSize } from './lecture-size'
import Status from 'common/page/page-table-status'
import FormModal from 'common/page/form-modal'
import ConfirmModal from 'common/page/confirm-modal'
import { IconButton } from 'common/button'
import Uploader from 'common/uploader'
import api from 'common/api'
import Tooltip from 'common/tooltip'

export default (class extends Base {
  columns = [
    {
      title: '讲义ID',
      dataIndex: 'handouts_id'
    }, {
      title: '讲义名称',
      dataIndex: 'name',
      render({ name }) {
        return <Tooltip title={name} />
      }
    }, {
      title: '讲义大小',
      dataIndex: 'size',
      render(data) {
        return renderLectureSize(data.size)
      }
    }, {
      title: '是否可用',
      dataIndex: 'status',
      render(data) {
        return <Status config={LECTURE_COMFIG_STATUS} value={data.status} />
      }
    }, {
      title: '上传时间',
      dataIndex: 'ctime'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }}>替换</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('delete', data)) }}>删除</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  editModelFields = [
    {
      render: ({ props, dispatch, state }) => {
        const { fname, handouts_id } = state.model
        return props.form.getFieldDecorator('upload', { initialValue: { fname } })(
          <Uploader
            accept=".pdf"
            onLoading={(loading) => dispatch(actions.modalLoading(loading))}
            onChange={(upload) => {
              api.systemLectureUpdate({ handouts_id, status: 1, ...upload }).then(() => {
                dispatch(actions.getPage())
              })
            }}
            isValid={({ fname }) => api.systemLectureHandoutsFileExists({ fname, handouts_id })}
            type="edit"
            fileType={1}
            loading={this.props.modalLoading}
          />
        )
      }
    }
  ]

  newModelFields = [
    {
      render: ({ props, dispatch }) => {
        return props.form.getFieldDecorator('upload')(
          <Uploader
            accept=".pdf"
            onLoading={(loading) => dispatch(actions.modalLoading(loading))}
            onChange={(upload) => {
              api.systemLectureAdd({ status: 1, ...upload }).then(() => {
                dispatch(actions.getPage())
              })
            }}
            isValid={({ fname, type }) => api.isFileExist({ fname, type })}
            type="add"
            fileType={1}
            loading={this.props.modalLoading}
          />
        )
      }
    }
  ]

  filters = [
    { label: '讲义ID', name: 'handouts_id', render: renderInput },
    { label: '讲义名称', name: 'name', render: renderInput },
    { label: '状态', name: 'status', options: [{ value: '1', label: '可用' }, { value: '2', label: '不可用' }], render: renderSelect },
    { label: '上传日期', name: 'range', render: renderRangePicker },
  ]

  buttons = <IconButton size="small" icon="add" onClick={() => { this.dispatch(actions.showModal('add')) }}>上传</IconButton>

  initState = ({ modalParams }) => {
    return {
      model: modalParams
    }
  }

  render() {
    return (
      <Page
        title="讲义列表"
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        buttons={this.buttons}
        selectId={i => i.handouts_id}
        exportUrl="/core/resource/admin/handouts/export"
      >
        <FormModal
          title="替换讲义"
          name="edit"
          modelFields={this.editModelFields}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          initState={this.initState}
        />
        <FormModal
          title="添加讲义"
          name="add"
          modelFields={this.newModelFields}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
        />
        <ConfirmModal
          title="操作提示"
          name="delete"
          message={"删除讲义记录，讲义文件会同步删除，请确认是否删除"}
          onCancel={() => this.dispatch(actions.hideModal('delete'))}
          onSave={({ handouts_id }) => this.dispatch(actions.delete({ handouts_id }))}
        />
      </Page>
    )
  }
}).connect((state) => {
  const { visible, modalLoading } = state.page

  return {
    visible,
    modalLoading
  }
})
