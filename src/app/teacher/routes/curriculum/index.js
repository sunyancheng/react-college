import React from 'react'
import Base from 'common/base'
import TimeTable from 'common/timetable';
import moment from 'moment'
import { Button } from 'common/button';
import actions from 'teacher/actions/curriculum'
import TeacherPage from 'teacher/components/teacher-page'
import PagePagination from 'common/page/page-pagination'
import TableEmpty from 'common/page/page-table/table-empty'
import { Select, Form } from 'antd'
import api from 'common/api'

export default (class extends Base {

  componentWillMount() {
    new Promise((resolve) => resolve(api.teacherClassList())).then(classList => {
      let { class_id, name, campus_name, major_name }= (classList[0] || {});
      this.dispatch(actions.initPage({ name, campus_name, major_name, classList, criteria: { tdate: moment().format('YYYY-MM-DD'), class_id } }))
      !!class_id && this.dispatch(actions.getList())
    });
  }

  componentWillUnmount() {
    this.dispatch(actions.clearPage())
  }

  changePagination = (...args) => this.dispatch(actions.changePagination(...args))

  render() {
    const { isInit } = this.props
    if (!isInit) return null
    var renderSelect = [<Button key={1} size="small" style={{ float: 'right', margin: '12px 0px 0px 10px' }} onClick={() => window.print()}>打印课表</Button>, (this.props.classList || []).length ? (
      <Form.Item key="0" label="选择班级" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ marginTop: 10, float: 'right' }}>
        <Select
          placeholder="请选择"
          allowClear
          showSearch
          style={{ width: 200 }}
          optionFilterProps="children"
          value={this.props.class_id}
          onSelect={(class_id) => {
            this.dispatch(actions.setPageState({ class_id }))
            this.dispatch(actions.getList({ class_id }))
          }}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
          }
        >
          {(this.props.classList || []).map(item => <Select.Option key={item.class_id} value={item.class_id}>{item.name}</Select.Option>)}
        </Select>
      </Form.Item>
    ) : null];
    return (
      <TeacherPage
        title="授课课表"
        fill
        buttons={renderSelect}
      >
        {this.props.class_id ?
        <TimeTable
          readOnly
          printable
          classInfo={this.props.classInfo}
          onChange={(tdate) => this.dispatch(actions.getList({ tdate, class_id: this.props.class_id }))}
          data={this.props.timetable}
          left={this.props.major}
        /> : <TableEmpty list={[]} />}
        <PagePagination onChange={this.changePagination} />
      </TeacherPage>
    )
  }
}).connect(state => {
  const { isInit, data = { timetable: [] }, classList = [], class_id = '', name: class_name, major_name, campus_name } = state.page
  return {
    isInit,
    timetable: data,
    classList,
    classInfo: { class_name, major_name, campus_name },
    major: data.major,
    class_id: class_id || (classList[0] || {}).class_id
  }
})
