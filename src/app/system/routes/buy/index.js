import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import { BUY_SYATUS } from 'common/config'
import { FormModalCombine } from 'common/page/form-modal'
import actions from 'system/actions/buy'
import { BtnGroup, Btn } from 'common/button-group'
import { DatePicker } from 'antd'
import Status from 'common/page/page-table-status'

export default (class extends Base {
  columns = [
    {
      title: '用户ID',
      dataIndex: 'user_id'
    }, {
      title: '用户姓名',
      dataIndex: 'user'
    }, {
      title: '商品类型',
      dataIndex: 'type_label'
    }, {
      title: '商品名称',
      dataIndex: 'item_name'
    }, {
      title: '商品ID',
      dataIndex: 'mixid'
    }, {
      title: '有效期（天）',
      dataIndex: 'valid_day'
    }, {
      title: '金额',
      dataIndex: 'price'
    }, {
      title: '班级',
      dataIndex: 'class'
    }, {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render(item) {
        return <Status config={BUY_SYATUS} value={item.status} />
      }
    }, {
      title: '购买时间',
      dataIndex: 'buy_time'
    }, {
      title: '到期时间',
      dataIndex: 'expire_time'
    }, {
      title: '操作',
      dataIndex: 'operate',
      width: 80,
      render: (item) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', item)) }} >延期</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  filters = [
    { label: '用户ID', name: 'user_id', render: renderInput },
    { label: '商品ID', name: 'mixid', render: renderInput },
    { label: '状态', name: 'status', options: BUY_SYATUS, render: renderSelect },
    { label: '购买日期', name: 'range', render: renderRangePicker },
  ]

  modelFields = [
    {
      field: 'buy_time',
      formItemProps: {
        label: '购买时间'
      },
      renderItem: 'static'
    },
    {
      field: 'expire_time',
      formItemProps: {
        label: '到期时间',
        wrapperCol: { span: 20 }
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '到期不能为空' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return <DatePicker style={{ width: 200 }} showTime format="YYYY-MM-DD HH:mm:ss" />
      }
    }
  ]

  initState = ({ modalParams }, momentize) => {
    return {
      model: momentize(modalParams, ['expire_time'], 'YYYY-MM-DD HH:mm:ss')
    }
  }

  render() {
    return (
      <Page
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        selectId={(i, index) => `${i.user_id}${index}`}
        exportUrl="/core/course/admin/buy/export"
      >
        <FormModalCombine
          title="延期"
          name="edit"
          initState={this.initState}
          dateFormat="YYYY-MM-DD HH:mm:ss"
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={({ expire_time }, { user_buycourse_id }) => this.dispatch(actions.edit({ expire_time, user_buycourse_id }))}
        />
      </Page>
    )
  }
}).connect(() => ({}))
