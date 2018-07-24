import React from 'react'
import Base from 'common/base';
import actions from 'admin/actions/lesson';
import { Button } from 'common/button';
import api from 'admin/api';
import FormModal from 'common/page/form-modal';
import { Form, Row, Col, Select } from 'antd';
import { Select2 } from 'common/select'
import { LESSON_CONFIG } from 'common/config'
import TimeTable from 'common/timetable';
import moment from 'moment';
import { PageLayout, PageContent, PageHeader } from 'common/page/page-layout'
import ConfirmModal from 'common/page/confirm-modal'
import Breadcrumb from 'common/breadcrumb'
import TableEmpty from 'common/page/page-table/table-empty'

const Option = Select.Option;

export default (class extends Base {

  state = {
    targetClassId: ''
  }

  buttons = [
    <Button key={1} size="small" onClick={() => window.print()}>打印课表</Button>,
  ]

  modelFields = [
    {
      field: 'name',
      formItemProps: {
        label: '课程名称',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '课程名称不能为空' },
        ],
      },
    },
    {
      hasPopupContainer: true,
      field: 'teacher',
      formItemProps: {
        label: '任课老师',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '任课老师不能为空' }
        ],
      }
    },
    {
      field: 'classroom',
      formItemProps: {
        label: '教室名称',
      },
    },
    {
      render({ props, state }) {
        let model = state.model || {}
        return <div>
          <Row>
            <Col span="12">
              <Form.Item label="时间安排" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>{props.form.getFieldDecorator('start_section', { initialValue: model.start_section || props.modalParams.start_section })(<Select2 showSearch options={LESSON_CONFIG} getValue={({ value }) => `${value}`} getLabel={({ label }) => label} />)}</Form.Item>
            </Col>
            <Col span="12" pull={2}>
              <Form.Item label="到" colon={false} labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>{props.form.getFieldDecorator('end_section', { initialValue: model.end_section || props.modalParams.end_section })(<Select2 showSearch options={LESSON_CONFIG} getValue={({ value }) => `${value}`} getLabel={({ label }) => label} />)}</Form.Item>
            </Col>
          </Row>
        </div>;
      }
    }
  ]

  initEditState({ modalParams }) {
    return {
      model: modalParams
    }
  }

  onAddValidSubmit = (criteria, modalParams) => {
    let tdate = modalParams.tdate;
    this.dispatch(actions.setCriteria({ tdate }));
    this.dispatch(actions.add({ ...criteria, tdate, class_id: this.props.class_id, disableReset: true }));
  }

  onEditValidSubmit = (criteria, { class_timetable_id, tdate }) => {
    this.dispatch(actions.setCriteria({ tdate }));
    this.dispatch(actions.edit({ ...criteria, class_timetable_id, tdate }));
  }

  componentDidMount() {
    Promise.all([
      api.adminLessonDetail({ class_id: this.props.match.params.id }),
      api.adminClassMajorList({})
    ]).then(([detail, majorList]) => {
      let major_id = detail.major_id || (majorList && majorList[0].major_id);
      let class_name = detail.name || (majorList && majorList[0].name);
      let major_name = detail.major_name || (majorList && majorList[0].major_name);
      let campus_name = detail.campus_name || (majorList && majorList[0].campus_name);
      this.handleSelectMajor(major_id, { label: major_name }, this.props.match.params.id)
      this.dispatch(actions.initPage({ majorList, major_name, class_name, campus_name, criteria: { major_id, class_id: this.props.match.params.id, tdate: moment().format('YYYY-MM-DD') } }))
    });
  }

  componentWillUnmount() {
    this.dispatch(actions.clearPage())
  }

  handleSelectMajor = (major_id, option, initialClassId) => {
    api.adminClassMajorClassList({ major_id }).then(classList => {
      let class_id = initialClassId || (classList && (classList[0] || {}).class_id) || '';
      this.dispatch(actions.setCriteria({ class_id, major_id }))
      this.dispatch(actions.setPageState({ major_name: option.label, classList: classList || [], data: {timetable: []} }))
      if (classList.length !== 0) {
        this.dispatch(actions.getList())
      }
    });
  }

  renderSelect() {
    return (
      [
        <Select
          key="1"
          showSearch
          style={{ width: 150 }}
          optionFilterProp="children"
          onChange={this.handleSelectMajor}
          value={this.props.major_id}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {(this.props.majorList || []).map((major, key) => <Option value={major.major_id} key={key} label={major.name}>{major.name}</Option>)}
        </Select>,
        <Select
          key="2"
          showSearch
          style={{ width: 150, marginLeft: 10 }}
          optionFilterProp="children"
          onChange={(class_id, option) => {
            this.dispatch(actions.setCriteria({ class_id }));
            this.dispatch(actions.setPageState({ class_name: option.label }))
            this.dispatch(actions.getList());
          }}
          value={this.props.class_id}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {(this.props.classList || []).map((majorClass, key) => <Option value={majorClass.class_id} key={key} label={majorClass.name}>{majorClass.name}</Option>)}
        </Select>]
    )
  }

  render() {
    return (
      <PageLayout>
        <PageHeader actions={actions} title={<Breadcrumb/>} btn={this.buttons} />
        <PageContent style={{ padding: '0 60px' }}>
          <TimeTable
            printable
            classInfo={this.props.classInfo}
            onAdd={(data) => this.dispatch(actions.showModal('add', data))}
            onEdit={(data) => this.dispatch(actions.showModal('edit', data))}
            onDelete={(data) => this.dispatch(actions.showModal('delete', data))}
            onChange={(tdate) => {
              this.dispatch(actions.setCriteria({ tdate }))
              this.dispatch(actions.getList())
            }}
            data={this.props.timetable}
            left={/*`${this.props.detail.major_name}·${this.props.detail.name}`*/
              this.renderSelect()
            }
          />
          {!this.props.class_id && <TableEmpty style={{ top: 180 }}list={[]} />}
        </PageContent>
        <div>
          <FormModal
            name="add"
            title="新建课表"
            initState={() => { }}
            modelFields={this.modelFields}
            onCancel={() => this.dispatch(actions.hideModal('add'))}
            onSave={this.onAddValidSubmit}
          />
          <FormModal
            name="edit"
            title="修改课表"
            initState={this.initEditState}
            modelFields={this.modelFields}
            onCancel={() => this.dispatch(actions.hideModal('edit'))}
            onSave={this.onEditValidSubmit}
          />
          <ConfirmModal
            title="操作提示"
            name="delete"
            message={"确认删除吗？"}
            onCancel={() => this.dispatch(actions.hideModal('delete'))}
            onSave={({ class_timetable_id }) => this.dispatch(actions.delete({ class_timetable_id }))}
          />
        </div>
      </PageLayout>
    )
  }
}).connect((state) => {
  let { majorList, classList, class_name, campus_name, major_name, data = { timetable: [] }, criteria: { class_id, major_id } } = state.page, { campus_id } = state.app;
  return {
    majorList,
    campus_id,
    classList,
    classInfo: { class_name, campus_name, major_name },
    timetable: data,
    class_id,
    major_id
  }
})
