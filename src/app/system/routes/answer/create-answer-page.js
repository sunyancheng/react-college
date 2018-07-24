import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import { FormModalStatic } from 'common/page/form-modal'
import ConfirmModal from 'common/page/confirm-modal'
import { BtnGroup, Btn } from 'common/button-group'
import Tooltip from 'common/tooltip'
import Status from 'common/page/page-table-status'
import { ANSWER_STATUS } from 'common/config'

export default ({ getAnswerDetail, columns = [], filters = [], actions, isDeleteAble = false, exportUrl = null }) => {
  const Answer = (class extends Base {

    columns = [
      {
        title: '问题ID',
        dataIndex: 'qa_id',
      }, {
        title: '提问课程',
        dataIndex: 'course',
      }, {
        title: '提问学员',
        dataIndex: 'user'
      }, {
        title: '问题',
        dataIndex: 'question',
        render({ question }) {
          return <Tooltip title={question} />
        }
      }, {
        title: '答疑状态',
        dataIndex: 'status',
        width: 100,
        render(item) {
          return <Status config={ANSWER_STATUS} value={item.status} />
        }
      }, {
        title: '答疑老师',
        dataIndex: 'teacher'
      }, {
        title: '提问日期',
        dataIndex: 'ctime',
        width: 150
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: 130,
        render: (data) => {
          return (
            <BtnGroup>
              <Btn onClick={() => { this.dispatch(actions.showModal('check', data)) }} >查看</Btn>
              {isDeleteAble && <Btn onClick={() => { this.dispatch(actions.showModal('delete', data)) }} >删除</Btn>}
            </BtnGroup>
          )
        }
      }
    ]

    checkModelFields = [
      {
        field: 'qa_id',
        formItemProps: {
          label: '问题ID',
        },
        renderItem: 'static'
      }, {
        field: 'campus',
        formItemProps: {
          label: '中心名称',
        },
        renderItem: 'static'
      }, {
        field: 'class_name',
        formItemProps: {
          label: '学员班级',
        },
        renderItem: 'static'
      }, {
        field: 'user',
        formItemProps: {
          label: '提问学员'
        },
        renderItem: 'static'
      }, {
        field: 'ctime',
        formItemProps: {
          label: '提问时间'
        },
        renderItem: 'static'
      }, {
        field: 'course',
        formItemProps: {
          label: '提问课程'
        },
        renderItem: 'static'
      }, {
        field: 'question',
        formItemProps: {
          label: '问题'
        },
        renderItem: 'static'
      }, {
        field: 'answer',
        formItemProps: {
          label: '答疑内容'
        },
        renderItem({ state }) {
          return <span>{state.model.status === '2' ? '未解答' : state.model.answer}</span>
        }
      }, {
        field: 'teacher',
        condition({ model }) {
          return model.status !== '2'
        },
        formItemProps: {
          label: '答疑老师'
        },
        renderItem: 'static'
      }, {
        field: 'utime',
        condition({ model }) {
          return model.status !== '2'
        },
        formItemProps: {
          label: '答疑时间'
        },
        renderItem: 'static'
      }
    ]

    initState = async ({ modalParams }) => {
      const { qa_id } = modalParams
      const detail = await getAnswerDetail({ qa_id })
      return {
        model: detail,
      }
    }

    render() {
      this.columns.splice(1, 0, ...columns)
      return (
        <Page
          actions={actions}
          filters={filters}
          columns={this.columns}
          selectId={i => i.qa_id}
          exportUrl={exportUrl}
        >
          <FormModalStatic
            title="查看问题"
            name="check"
            modelFields={this.checkModelFields}
            onCancel={() => this.dispatch(actions.hideModal('check'))}
            initState={this.initState}
          />
          <ConfirmModal
            title="操作提示"
            name="delete"
            message={"删除后，记录将不可恢复，请确认操作！"}
            onCancel={() => this.dispatch(actions.hideModal('delete'))}
            onSave={({ qa_id }) => this.dispatch(actions.delete({ qa_id }))}
          />
        </Page>
      )
    }
  }).connect(() => ({}))
  return Answer
}
