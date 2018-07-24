import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import actions from 'system/actions/exercise-record'
import { renderInput, renderRangePicker } from 'common/page/page-filter/filter'
import { FormModalStatic } from 'common/page/form-modal'
import ConfirmModal from 'common/page/confirm-modal'
import { BtnGroup, Btn } from 'common/button-group'

export default (class extends Base {
  columns = [
    {
      title: '记录ID',
      dataIndex: 'user_resource_id'
    }, {
      title: '学员姓名',
      dataIndex: 'student_name'
    }, {
      title: '课程名称',
      dataIndex: 'course_name'
    }, {
      title: '练习名称',
      dataIndex: 'exam_name'
    }, {
      title: '练习成绩',
      dataIndex: 'result'
    }, {
      title: '练习时长',
      dataIndex: 'duration_label'
    }, {
      title: '练习时间',
      dataIndex: 'ctime'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('check', data)) }} >查看</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('delete', data)) }} >删除</Btn>
          </BtnGroup>
        )
      }
    }
  ]
  filters = [
    { label: '学员姓名', name: 'student_name', render: renderInput },
    { label: '课程名称', name: 'course_name', render: renderInput },
    { label: '练习名称', name: 'exam_name', render: renderInput },
    { label: '练习日期', name: 'range', render: renderRangePicker },
  ]

  checkModelFields = [
    {
      field: 'user_resource_id',
      formItemProps: {
        label: '记录ID'
      },
      renderItem({ state }) {
        return <span>{state.detail.item.user_resource_id}</span>
      }
    }, {
      field: 'user_name',
      formItemProps: {
        label: '学员姓名'
      },
      renderItem({ state }) {
        return <span>{state.detail.item.user_name}</span>
      }
    }, {
      field: 'campus_name',
      formItemProps: {
        label: '中心名称'
      },
      renderItem({ state }) {
        return <span>{state.detail.item.campus_name}</span>
      }
    }, {
      field: 'class_name',
      formItemProps: {
        label: '班级名称'
      },
      renderItem({ state }) {
        return <span>{state.detail.item.class_name}</span>
      }
    }, {
      field: 'course_name',
      formItemProps: {
        label: '课程名称'
      },
      renderItem({ state }) {
        return <span>{state.detail.item.course_name}</span>
      }
    }, {
      field: 'exam_name',
      formItemProps: {
        label: '练习名称'
      },
      renderItem({ state }) {
        return <span>{state.detail.item.exam_name}</span>
      }
    }, {
      field: 'result',
      formItemProps: {
        label: '练习成绩'
      },
      renderItem({ state }) {
        return <span>{state.detail.item.result}</span>
      }
    }, {
      field: 'duration_label',
      formItemProps: {
        label: '练习时长'
      },
      renderItem({ state }) {
        return <span>{state.detail.item.duration_label}</span>
      }
    }, {
      field: 'ctime',
      formItemProps: {
        label: '练习时间'
      },
      renderItem({ state }) {
        return <span>{state.detail.item.ctime}</span>
      }
    }
  ]

  addMenu = () => this.dispatch(actions.showModal('add'))

  initState = async ({ modalParams }) => {
    const { user_resource_id } = modalParams
    const detail = await actions.getOneStudentExam(user_resource_id)
    return {
      model: modalParams,
      detail
    }
  }

  render() {
    return (
      <Page
        title="练习记录"
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        selectId={i => i.user_resource_id}
        exportUrl="/core/resource/admin/exam/student-exam-export"
      >
        <FormModalStatic
          title="练习记录/练习详情"
          name="check"
          modelFields={this.checkModelFields}
          onCancel={() => this.dispatch(actions.hideModal('check'))}
          onSave={() => this.dispatch(actions.hideModal('check'))}
          initState={this.initState}
        />
        <ConfirmModal
          title="操作提示"
          name="delete"
          message={"删除后，记录将不可恢复，请确认操作！"}
          onCancel={() => this.dispatch(actions.hideModal('delete'))}
          onSave={({ user_resource_id }) => this.dispatch(actions.delete({ user_resource_id }))}
        />
      </Page>
    )
  }
}).connect(() => ({}))
