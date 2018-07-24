import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import actions from 'system/actions/target';
import { renderInput, renderSelect } from 'common/page/page-filter/filter'
import { BtnGroup, Btn } from 'common/button-group'
import Status from 'common/page/page-table-status'
import { TARGET_STATUS, TARGET_DETAIL_TYPE } from 'common/config';
import ConfirmModal from 'common/page/confirm-modal'
// import './style.less';
import { IconButton } from 'common/button'
import Breadcrumb from 'common/breadcrumb';

export default (class extends Base {
  columns = [
    {
      title: '标靶ID',
      dataIndex: 'target_id',
      key: 'target_id',
    }, {
      title: '标靶名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '标靶类型',
      dataIndex: 'detail_type_label',
      key: 'detail_type_label',
      render: ({ detail_type }) => (TARGET_DETAIL_TYPE.find(item => item.value === detail_type) || {}).label
    }, {
      title: '系统类型',
      dataIndex: 'os_label',
      key: 'os_label'
    }, {
      title: '大小',
      dataIndex: 'mirr_config_label',
      key: 'mirr_config_label'
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: ({ status }) => <Status config={TARGET_STATUS} value={status} />
    }, {
      title: '操作',
      width: 130,
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.props.history.push(`target/edit/${data.target_id}`) }} >修改</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('delete', data)) }} >删除</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  filters = [
    { label: '标靶ID', name: 'target_id', render: renderInput },
    { label: '标靶名称', name: 'name', render: renderInput },
    { label: '类型', name: 'detail_type', options: TARGET_DETAIL_TYPE, render: renderSelect },
  ]

  buttons = <IconButton size="small" icon="add" onClick={() => { this.props.history.push('/target/create') }}>新建</IconButton>

  render() {
    return (
      <Page
        title={<Breadcrumb />}
        buttons={this.buttons}
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        selectId={i => i.target_id}
        exportUrl="/core/resource/admin/target/export"
      >
        <ConfirmModal
          title="操作提示"
          name="delete"
          message={"确认是否删除?"}
          onCancel={() => this.dispatch(actions.hideModal('delete'))}
          onSave={({ target_id }) => this.dispatch(actions.delete({ target_id }))}
        />
      </Page>
    )
  }
}).connect((state) => {
  const visible = state.page.modalVisible
  return {
    visible,
  }
})
