
import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-export-breadcrumb'
import actions from 'system/actions/student'
import { Input, Modal, Icon } from 'antd'
import { Button } from 'common/button'
import { BtnGroup, Btn } from 'common/button-group'
import { STUDENT_STATUS, STUDENT_AUDIT_STATUS } from 'common/config'
import FormModal, { FormModalStatic, FormModalCombine } from 'common/page/form-modal'
import api from 'common/api'
import Status from 'common/page/page-table-status'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import { Select2 } from 'common/select'
import Alert from 'common/alert'
import './style.less'
const TextArea = Input.TextArea;

const isAuditStatus = s => !!['6', '7'].find(v => v == s)
const ModalContent = ({ text }) => {
  return [
    <div key="title"><Icon className="icon-warning " style={{ marginRight: 12 }} type="exclamation-circle" /><span className="modal-text">确认修改学员状态？</span></div>,
    <div key="content" className="modal-text">该学生报档状态被修改为<span style={{ color: 'red' }}>{text}</span>，<span style={{ color: 'red' }}>学员数据将被清空</span>，此操作不可逆。</div>
  ]
}
class StaticText extends React.Component {
  render() {
    var value = this.props.value
    if (Array.isArray(value)) {
      value = value.join()
    }
    return <span>{this.props.value}</span>
  }
}
export default (class extends Base {
  state = {
    exchangeVisible: false,
    refundVisible: false
  }
  columns = [
    {
      title: '学号',
      width: 150,
      dataIndex: 'student_id'
    },
    {
      title: ' 中心名称',
      dataIndex: 'campus_name'
    }, {
      title: '姓名',
      dataIndex: 'user_name'
    }, {
      title: ' 专业名称',
      dataIndex: 'major_name'
    }, {
      title: '报档状态',
      dataIndex: 'status',
      render({ status }) {
        return <Status config={STUDENT_STATUS} value={status} />
      }
    }, {
      title: '报档日期',
      dataIndex: 'cdate'
    }, {
      title: '审核日期',
      dataIndex: 'audit_date'
    }, {
      title: '操作',
      width: 160,
      dataIndex: 'operation',
      render: (data) => {
        const isAudit = isAuditStatus(data.status)
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('view', data)) }} >查看</Btn>
            {!isAudit && <Btn onClick={() => { this.dispatch(actions.showModal('edit', data)) }} >修改</Btn>}
            {isAudit && <Btn onClick={() => { this.dispatch(actions.showModal('audit', data)) }} >审核</Btn>}
          </BtnGroup>
        )
      }
    }
  ]


  filters = [
    { label: '中心名称', name: 'campus_name', render: renderInput },
    { label: '专业名称', name: 'major_name', render: renderInput },
    { label: '报档状态', name: 'status', options: STUDENT_STATUS, render: renderSelect },
    { label: '姓名', name: 'user_name', render: renderInput },
    { label: '报档日期', name: 'range', render: renderRangePicker },
  ]

  initViewState = ({ modalParams }) => {
    return api.systemStudentDetail({ class_student_id: modalParams.class_student_id }).then(model => ({ model }))
  }

  initEditState = async ({ modalParams: { class_student_id } }) => {
    return Promise.all([
      api.systemStudentDetail({ class_student_id: class_student_id }),
      api.systemStudentStatusList({ class_student_id: class_student_id })
    ]).then(([detail, statusList]) => {
      return {
        model: detail,
        statusList
      }
    })
  }

  viewModelFields = [
    ['campus_name', '中心名称'],
    ['account', '学员账号'],
    ['student_id', '学员学号'],
    ['name', '学员姓名'],
    ['pinyin', '拼音'],
    ['gender_label', '性别'],
    ['mail', '邮箱'],
    ['id_type_label', '证件类型'],
    ['id_no', '证件号码'],
    ['degree_label', '最高学历'],
    ['major', '专业', ({ model }) => model.degree != 7],
    ['school', '毕业学校', ({ model }) => model.degree != 7],
    ['graduation_date', '毕业时间', ({ model }) => model.degree != 7],
    ['status_label', '工作状态'],
    ['major_name', '专业名称'],
    ['class_name', '班级名称'],
    ['charge_name', '班主任'],
    ['id_city', '户籍所在城市'],
    ['live_city', '目前所在城市'],
    ['memo', '备注'],
    ['user_status_label', '报档状态'],
    ['audit_opinion', '审核意见']
  ].map(([field, label, condition]) => ({
    field,
    condition,
    formItemProps: {
      label,
      labelCol: { span: 6 },
      wrapperCol: { span: 17 }
    },
    renderItem() { return <StaticText /> }
  }))

  editModelFields = this.viewModelFields.concat([
    {
      hasPopupContainer: true,
      field: 'user_status',
      formItemProps: {
        label: '报档状态',
        labelCol: { span: 6 },
        wrapperCol: { span: 17 }
      },
      fieldDecorator: {
        rules: [
          { requireds: true, message: '请选择报档状态' }
        ],
      },
      renderItem: ({ state: { statusList } }) => {
        const LIST = STUDENT_STATUS.filter(s => statusList.find(v => v == s.value))
        return (
          <Select2 onChange={(v) => {
            if (v == 4) { this.setState({ exchangeVisible: true }) }
            if (v == 5) { this.setState({ refundVisible: true }) }
          }} showSearch disabled={!(LIST.length - 1)} options={LIST} getValue={({ value }) => value} getLabel={({ label }) => label}
          />
        )
      }
    }
  ])
  auditModelFields = this.viewModelFields.filter(v => v.field !== 'audit_opinion').concat([
    {
      hasPopupContainer: true,
      field: 'audit_status',
      formItemProps: {
        label: '审核结果',
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '请选择审核结果' }
        ],
      },
      renderItem() {
        return <Select2 showSearch options={STUDENT_AUDIT_STATUS} getValue={({ value }) => value} getLabel={({ label }) => label} />
      }
    }, {
      field: 'audit_opinion',
      formItemProps: {
        label: '审核意见'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '审核意见不能为空' }
        ]
      },
      renderItem() {
        return <TextArea rows="5" />;
      }
    },
  ])

  onAuditValidSubmit = ({ audit_opinion, audit_status }, { class_student_id }) => {
    this.dispatch(actions.audit({ class_student_id, audit_opinion, audit_status }))
  }

  onEditValidSubmit = ({ user_status }, { class_student_id }, { statusList }) => {
    if ((['4', '5'].find(v => v == user_status)) && !(statusList.length - 1)) {
      Alert.success("操作成功")
      this.dispatch(actions.hideModal('edit'))
    } else {
      this.dispatch(actions.edit({ class_student_id, status: user_status }))
    }
  }

  handleCancel = (modalName) => () => {
    this.setState({
      [modalName]: false
    })
  }

  render() {
    const { exchangeVisible, refundVisible } = this.state
    return (
      <Page
        title="学员管理"
        actions={actions}
        filters={this.filters}
        columns={this.columns}
        selectId={i => i.class_student_id}
        exportUrl="/home/user/admin/student/export"
      >
        <FormModalStatic
          name="view"
          title="查看"
          initState={this.initViewState}
          modelFields={this.viewModelFields}
          onCancel={() => this.dispatch(actions.hideModal('view'))}
        />
        <FormModalCombine
          name="edit"
          title="修改"
          initState={this.initEditState}
          modelFields={this.editModelFields}
          onCancel={() => this.dispatch(actions.hideModal('edit'))}
          onSave={this.onEditValidSubmit}
        />
        <FormModal
          name="audit"
          title="审核"
          initState={this.initViewState}
          modelFields={this.auditModelFields}
          onCancel={() => this.dispatch(actions.hideModal('audit'))}
          onSave={this.onAuditValidSubmit}
        />
        <Modal zIndex={1001} maskClosable={false} visible={exchangeVisible} footer={<Button type="danger" size="small" onClick={this.handleCancel('exchangeVisible')}>我已知晓</Button>} onCancel={this.handleCancel('exchangeVisible')}>
          <ModalContent text="转班" />
        </Modal>
        <Modal zIndex={1001} maskClosable={false} visible={refundVisible} footer={<Button type="danger" size="small" onClick={this.handleCancel('refundVisible')}>我已知晓</Button>} onCancel={this.handleCancel('refundVisible')}>
          <ModalContent text="退费" />
        </Modal>
      </Page>
    )
  }
}).connect(state => {
  const statusLabels = state.page.statusLabels
  return {
    statusLabels
  }
})
