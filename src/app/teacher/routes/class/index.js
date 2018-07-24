import React from 'react'
import Base from 'common/base'
import PageTable from 'user/components/page-table'
import actions from 'teacher/actions/class'
import { STUDENT_STATUS } from 'common/config'
import { Select, Form } from 'antd'
import { FormModalStatic } from 'common/page/form-modal'
import { BtnGroup, Btn } from 'common/button-group'
import PagePagination from 'common/page/page-pagination'
import api from 'common/api'
import Status from 'common/page/page-table-status'
import TeacherPage from 'teacher/components/teacher-page'
import TableEmpty from 'common/page/page-table/table-empty'
import Tooltip from 'common/tooltip'
import Portrait from 'common/portrait'
import Thumb from 'common/thumb'

const showMajor = ({ state }) => {
  return !(state.model.degree_label === '其他')
}
export default (class extends Base {

  componentWillMount() {
    new Promise((resolve) => resolve(api.teacherClassList())).then(classList => {
      this.dispatch(actions.initPage({ classList }))
      const class_id = (classList[0] || {}).class_id
      !!class_id && this.dispatch(actions.getPage({ class_id }))
    });
  }

  componentWillUnmount() {
    this.dispatch(actions.clearPage())
  }

  models = [
    ['student_id', '学员学号'],
    ['name', '学员姓名'],
    ['pinyin', '拼音'],
    ['nickname', '昵称'],
    ['gender_label', '性别'],
    ['mail', '邮箱'],
    ['id_city', '户籍所在城市', function ({ state }) {
      let { id_city } = (state.model || {});
      return <span>{id_city.join('')}</span>
    }, { labelCol: { span: 5 }, wrapperCol: { span: 17 } }],
    ['live_city', '目前所在城市', function ({ state }) {
      let { live_city } = (state.model || {});
      return <span>{live_city.join('')}</span>
    }, { labelCol: { span: 5 }, wrapperCol: { span: 17 } }],
    ['degree_label', '最高学历'],
    ['major', '专业', undefined, {}, showMajor],
    ['school', '毕业学校', undefined, {}, showMajor],
    ['graduation_date', '毕业时间', undefined, {}, showMajor],
    ['status_label', '工作状态'],
    ['campus_name', '所在中心'],
    ['major_name', '专业名称'],
    ['class_name', '班级'],
    ['charge_name', '班主任姓名'],
    ['cdate', '报档日期', undefined, {}],
    ['user_status_label', '档案状态'],
    ['open_day', '学习进度', function ({ state }) {
      let { open_day, open_status } = (state.model || {});
      return <span>{open_status === '1' ? '已开班' : '未开班，距开班还有'}{open_day}天</span>
    }],
    ['exam', '练习', function ({ state }) {
      let { done_item, score, rank } = (state.model.exam || {});
      return <span>{done_item}题 （{score}分，班级排名第{rank}）</span>
    }],
    ['experiment', '实验', function ({ state }) {
      let { done, undo } = (state.model.experiment || {});
      return <span>已做 {done}，未做{undo}</span>
    }],
    ['qa', '提问', function ({ state }) {
      let { total, answered } = (state.model.qa || {});
      return <span>{total}（已回答{answered}）</span>
    }],
    ['memo', '备注'],
  ]

  checkModelFields = [
    {
      render({ props, state }) {
        return props.form.getFieldDecorator('avatar', { initialValue: state.model.avatar })(
          <Portrait readonly={true} style={{ position: 'absolute', top: 0, right: 20 }} />
        )
      }
    },
    ...this.models.map(([field, label, renderItem, formItemPropsConfig, condition]) => ({
      field,
      condition: !!condition ? condition : () => { return true },
      formItemProps: {
        label,
        ...formItemPropsConfig
      },
      renderItem: renderItem || 'static'
    }))]

  columns = [
    {
      title: '学号',
      width: 200,
      dataIndex: 'student_id'
    }, {
      title: '姓名',
      dataIndex: 'name',
      render({name, avatar}) {
        return <Thumb name={name} avatar={avatar} />
      }
    }, {
      title: '专业方向',
      dataIndex: 'major_name',
      render({ major_name }) {
        return <Tooltip title={major_name} />
      }
    }, {
      title: '班级',
      dataIndex: 'class_name',
      render({ class_name }) {
        return <Tooltip title={class_name} />
      }
    }, {
      title: '性别',
      dataIndex: 'gender_label'
    }, {
      title: '状态',
      dataIndex: 'status',
      render(item) {
        return <Status config={STUDENT_STATUS} value={item.status} />
      }
    }, {
      title: '报档日期',
      dataIndex: 'cdate'
    },
    {
      title: '操作',
      width: 100,
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('check', data)) }} >查看</Btn>
          </BtnGroup>
        );
      }
    },
  ]

  initState({ modalParams }) {
    const { class_student_id } = modalParams
    return Promise.all([
      api.teacherClassStudentDetail({ class_student_id }),
      api.teacherClassStudentResourceDetail({ class_student_id })
    ]).then(([detail1, detail2]) => ({ model: { ...detail1, ...detail2 } }))
  }

  changePagination = (...args) => this.dispatch(actions.changePagination(...args, {class_id: this.props.class_id}))

  getSelectClass() {
    const { classList } = this.props
    const renderSelect = (
      <Form.Item label="选择班级" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ marginTop: 10 }}>
        <Select
          placeholder="请选择"
          allowClear
          showSearch
          label="选择班级"
          style={{ width: 200 }}
          optionFilterProps="children"
          value={this.props.class_id}
          onSelect={(class_id) => {
            this.dispatch(actions.setPageState({ class_id }))
            this.dispatch(actions.getPage({ class_id }))
          }}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
          }
        >
          {(this.props.classList || []).map(item => <Select.Option key={item.class_id} value={item.class_id}>{item.name}</Select.Option>)}
        </Select>
      </Form.Item>
    )
    return (
      classList && classList.length > 0
        ? (renderSelect)
        : null
    )
  }

  renderTable = () => {
    return [
      <PageTable
        key={1}
        actions={actions}
        columns={this.columns}
        selectId={(i, index) => i.class_student_id + index}
      />,
      <PagePagination key={2} onChange={this.changePagination} />
    ]
  }

  renderEmpty = () => {
    return (
      <TableEmpty list={[]} />
    )
  }

  render() {
    const { isInit } = this.props
    if (!isInit) return null

    return (
      <TeacherPage
        fill
        title="授课班级"
        buttons={this.getSelectClass()}
      >
        {
          !!this.getSelectClass()
            ? this.renderTable()
            : this.renderEmpty()
        }
        <FormModalStatic
          title="查看"
          name="check"
          modelFields={this.checkModelFields}
          onCancel={() => this.dispatch(actions.hideModal('check'))}
          initState={this.initState}
        />
      </TeacherPage>
    );
  }
}).connect(state => {
  const { isInit, classList = [], class_id = '' } = state.page
  return {
    isInit,
    classList,
    class_id: class_id || (classList[0] || {}).class_id
  }
})


