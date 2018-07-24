import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import actions from 'system/actions/scene'
import { renderInput, renderSelect, renderRangePicker } from 'common/page/page-filter/filter'
import Status from 'common/page/page-table-status'
import { SCENE_STATUS, SCENE_ABNORMAL, SCENE_STATUS_FOR_QUERY } from 'common/config'
import { BtnGroup, Btn } from 'common/button-group'
import ConfirmModal from 'common/page/confirm-modal'
import Confirm from './confirm'
import Popover from 'common/popover'
import api from 'common/api'
import Alert from 'common/alert';

export default (
  class extends Base {
    columns = [
      {
        title: '记录ID',
        dataIndex: 'user_experiment_id'
      }, {
        title: '实验ID',
        dataIndex: 'experiment_id'
      }, {
        title: '实验名称',
        dataIndex: 'experiment_name',
        render(item) {
          return <Popover title={item.experiment_name}><div className="text-omit">{item.experiment_name}</div></Popover>
        }
      }, {
        title: '实验人ID',
        dataIndex: 'user_id'
      }, {
        title: '中心名称',
        dataIndex: 'campus_name'
      }, {
        title: '状态',
        dataIndex: 'create_status',
        render(item) {
          return <Status config={SCENE_STATUS} value={item.create_status} />
        }
      }, {
        title: '实验时长（分钟）',
        dataIndex: 'time'
      }, {
        title: '开始实验时间',
        dataIndex: 'create_complete_time'
      }, {
        title: '操作',
        dataIndex: 'operation',
        render: (item) => {
          return (
            <BtnGroup>
              {SCENE_ABNORMAL.includes(item.create_status) && <Btn onClick={() => { this.dispatch(actions.showModal('end', item)) }} >结束</Btn>}
            </BtnGroup>
          )
        }
      }
    ]

    filters = [
      { label: '记录ID', name: 'user_experiment_id', render: renderInput },
      { label: '实验ID', name: 'experiment_id', render: renderInput },
      { label: '实验名称', name: 'experiment_name', render: renderInput },
      { label: '实验人ID', name: 'user_id', render: renderInput },
      { label: '中心名称', name: 'campus_name', render: renderInput },
      { label: '状态', name: 'experiment_status', options: SCENE_STATUS_FOR_QUERY, render: renderSelect },
      { label: '实验日期', name: 'create_at', render: renderRangePicker },
    ]

    handleClose = (user_experiment_id) => {
      api.getSceneEnd({ user_experiment_id })
        .then(() => {
          this.dispatch(actions.getPage())
          Alert.success('操作成功');
        })
    }

    render() {
      return (
        <Page
          actions={actions}
          filters={this.filters}
          columns={this.columns}
          selectId={i => i.user_experiment_id}
          exportUrl="/core/resource/admin/user-experiment/export"
        >
          <ConfirmModal
            title="操作提示"
            name="end"
            message={<Confirm />}
            onCancel={() => this.dispatch(actions.hideModal('end'))}
            onSave={(modalParams) => this.handleClose(modalParams.user_experiment_id)}
          />
        </Page>
      )
    }
  }
).connect(() => ({}))
