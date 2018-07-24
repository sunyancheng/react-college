import React from 'react';
import Base from 'common/base';
import Page from 'common/page/page-with-breadcrumb';
import actions from 'admin/actions/class';
import { Button } from 'common/button';
import { BtnGroup, Btn } from 'common/button-group';
import { CLASS_STATUS, CLASS_PROGRESS_STATUS_OPEN } from 'common/config';
import FormModal from 'common/page/form-modal';
import { Select2 } from 'common/select'
import Status from 'common/page/page-table-status'
import { api } from 'admin/api';
import moment from 'moment';
import { DatePicker, Input, Switch, Table } from 'antd';
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter';
import Tooltip from 'common/tooltip';
import './style.less'
const TextArea = Input.TextArea;
export default (class extends Base {
  state = {
    progress: {}
  }
  progressColumns = [{
    title: '模块名称',
    dataIndex: 'module_name',
    key: 'module_name',
    width: 130,
    render(a) {
      return <Tooltip title={a} />
    }
  }, {
    title: '课程名称',
    dataIndex: 'course_name',
    key: 'course_name',
    width: 130,
    render(a) {
      return <Tooltip title={a} />
    }
  }, {
    title: '教学推荐时间',
    dataIndex: 'rec_day',
    key: 'rec_day',
  }, {
    title: '学习挡板',
    dataIndex: 'switch',
    key: 'switch',
    render: (switch1, record) => {
      let status = this.state.progress[record.course_id] || switch1
      return (
        <Switch checked={status == CLASS_PROGRESS_STATUS_OPEN} onChange={() => {
          this.setState((prevState) => {
            let status1 = prevState.progress[record.course_id] || switch1
            prevState.progress[record.course_id] = `${2 / status1}`;
            return prevState;
          });
        }}
        />
      )
    }
  }];

  columns = [
    {
      title: '班级ID',
      dataIndex: 'class_id'
    }, {
      title: '班级名称',
      dataIndex: 'name'
    }, {
      title: '专业方向',
      dataIndex: 'major_name'
    }, {
      title: '班主任',
      dataIndex: 'charge_name'
    }, {
      title: '状态',
      dataIndex: 'status',
      render({ status }) {
        return <Status config={CLASS_STATUS} value={status} />
      }
    }, {
      title: '开班日期',
      dataIndex: 'open_date'
    }, {
      title: '操作',
      width: 200,
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }} >修改</Btn>
            <Btn onClick={() => { this.dispatch(actions.showModal('progress', data)) }} >进度</Btn>
            <Btn onClick={() => { this.props.history.push(`/class/manage/${data.class_id}`) }} >排课</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  buttons = [
    <Button key={1} size="small" onClick={() => { this.dispatch(actions.showModal('add', {})) }}>新建</Button>,
  ]

  filters = [
    { label: '班级ID', name: 'class_id', placeholder: '班级ID', render: renderInput },
    { label: '班级名称', name: 'name', placeholder: '班级名称', render: renderInput },
    { label: '状态', name: 'status', options: [{ value: '1', label: '进行中' }], placeholder: '状态', render: renderSelect },
    { label: '开班日期', name: 'open_date', render: renderRangePicker },
  ]

  modelFields = [
    {
      field: 'name',
      formItemProps: {
        label: '班级名称',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '班级名称不能为空' },
        ],
      },
    },
    {
      hasPopupContainer: true,
      field: 'major_id',
      formItemProps: {
        label: '专业方向',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '请选择专业方向' }
        ],
      },
      renderItem({ state }) {
        return <Select2 showSearch options={state.majorList} getValue={({ major_id }) => major_id} getLabel={({ name }) => name} />
      }
    },
    {
      hasPopupContainer: true,
      field: 'charge_id',
      formItemProps: {
        label: '班主任',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '请选择班主任' }
        ],
      },
      renderItem({ state }) {
        var teacherList = state.teacherList.list
        return <Select2 showSearch options={teacherList} getValue={({ teacher_id }) => teacher_id} getLabel={({ name }) => name} />
      }
    },
    {
      hasPopupContainer: true,
      field: 'teacher_ids',
      formItemProps: {
        label: '任课老师',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '请选择至少一名任课老师' }
        ],
      },
      renderItem({ state }) {
        var teacherList = state.teacherList.list
        return <Select2 mode="multiple" showSearch options={teacherList || []} getValue={({ teacher_id }) => teacher_id} getLabel={({ name }) => name} />
      }
    },
    {
      field: 'open_date',
      formItemProps: {
        label: '开班日期',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '开班日期不能为空' }
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return <DatePicker format="YYYY-MM-DD" />
      }
    },
    {
      field: 'memo',
      formItemProps: {
        label: '备注',
        wrapperCol: {
          span: 19
        }
      },
      fieldDecorator: {
        rules: [
          // { required: true, message: '个人简介不能为空' },
          { pattern: /^[\S\s]{1,400}$/, message: '不能超过400个字符' }
        ],
      },
      renderItem() {
        return <TextArea rows="5" />;
      }
    },
  ]

  progressFields = [
    {
      render: ({ props, state }) => {
        return props.form.getFieldDecorator('progress')(<div className="class-progress-field">
          <h4>班级名称：{props.modalParams.name}</h4>
          <Table className="class-table" rowKey="module_course_map_id" dataSource={state.progressList || []} columns={this.progressColumns} size="small" pagination={false} />
        </div>);
      }
    },
  ]

  onProgressSwitch = () => {

  }

  initEditState(modalParams, campus_id, ) {
    return Promise.all([
      api.adminTeacherSimpleList({ campus_id, teacher_status: 1 }),  // 1 正常老师
      api.adminClassMajorList(),
      api.adminClassDetail({ class_id: modalParams.class_id })
    ]).then(([teacherList, majorList, model]) => {
      model.open_date = moment(model.open_date)
      return {
        teacherList,
        majorList,
        model
      }
    })
  }

  initState(_, campus_id) {
    return Promise.all([
      api.adminTeacherSimpleList({ campus_id, teacher_status: 1 }),  // 1 正常老师
      api.adminClassMajorList()
    ]).then(([teacherList, majorList]) => {
      return {
        teacherList,
        majorList,
        model: {}
      }
    })
  }

  initProgressState = ({ modalParams }) => {
    this.setState({ progress: {} })
    return api.adminClassProgressList({ class_id: modalParams.class_id }).then(progressList => ({
      progressList
    }));
  }

  onAddValidSubmit = (criteria) => {
    this.dispatch(actions.add(criteria))
  }

  onEditValidSubmit = (criteria, { class_id }) => {
    this.dispatch(actions.edit({ ...criteria, teacher_ids: criteria.teacher_ids.join(','), class_id }))
  }

  onProgressValidSubmit = (_, modalParams) => {
    let switches = Object.keys(this.state.progress).map(item => ({ course_id: item, switch: this.state.progress[item] }))
    this.dispatch(actions.progressUpdate({ class_id: modalParams.class_id, switches: JSON.stringify(switches) }))
  }

  render() {
    return (
      <Page
        buttons={this.buttons}
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        selectId={i => i.class_id}
      >
        <FormModal
          name="add"
          title="新建班级"
          initState={({ modalParams }) => this.initState(modalParams, this.props.campus_id)}
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('add'))}
          onSave={this.onAddValidSubmit}
        />
        <FormModal
          name="edit"
          title="修改班级"
          initState={({ modalParams }) => this.initEditState(modalParams, this.props.campus_id)}
          modelFields={this.modelFields}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={this.onEditValidSubmit}
        />
        <FormModal
          name="progress"
          title="进度管理"
          initState={this.initProgressState}
          modelFields={this.progressFields}
          onCancel={() => this.dispatch(actions.hideModal('progress'))}
          onSave={this.onProgressValidSubmit}
        />
      </Page>
    )
  }
}).connect(state => {
  const { campus_id } = state.app
  return {
    progress: {},
    campus_id
  }
})
