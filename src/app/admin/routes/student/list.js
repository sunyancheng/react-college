
import React from 'react'
import Base from 'common/base'
import Page from 'common/page/page-with-breadcrumb'
import actions from 'admin/actions/student'
import { Button } from 'common/button'
import { BtnGroup, Btn } from 'common/button-group'
import { STUDENT_STATUS } from 'common/config'
import FormModal, { FormModalStatic } from 'common/page/form-modal'
import api from 'admin/api'
import FileInput from 'common/file-input'
import Status from 'common/page/page-table-status'
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import Alert from 'common/alert'

export default (class extends Base {
  columns = [
    {
      title: '学号',
      width: 150,
      dataIndex: 'student_id'
    }, {
      title: '姓名',
      dataIndex: 'user_name'
    }, {
      title: '专业方向',
      dataIndex: 'major_name'
    }, {
      title: '班级',
      dataIndex: 'class_name'
    }, {
      title: '状态',
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
      width: 200,
      dataIndex: 'operation',
      render: (data) => {
        return (
          <BtnGroup>
            <Btn onClick={() => { this.dispatch(actions.showModal('view', data)) }} >查看</Btn>
            <Btn onClick={() => { this.props.history.push('/student/update/' + data.class_student_id) }} >修改</Btn>
          </BtnGroup>
        )
      }
    }
  ]

  buttons = [
    <Button key={1} size="small" onClick={() => this.props.history.push('/student/create')}>报档</Button>,
    <Button key={2} size="small" onClick={() => { this.dispatch(actions.showModal('batchAdd', {})) }}>批量报档</Button>
  ]

  getFilters = () => [
    { key: 1, label: '学号', name: 'student_id', render: renderInput },
    { key: 2, label: '姓名', name: 'user_name', render: renderInput },
    { key: 3, label: '班级', name: 'class_id', options: (this.props.classList || []).map(({ name: label, class_id: value }) => ({ label, value, desc: `(${value})` })), placeholder: '班级', render: renderSelect },
    { key: 4, label: '状态', name: 'status', options: STUDENT_STATUS, placeholder: '状态', render: renderSelect },
    { key: 5, label: '报档日期', name: 'range', render: renderRangePicker },
  ]

  initState = () => {
    return Promise.all([
      api.adminCampusClassList(),
    ]).then(([classList]) => {
      return { classList }
    })
  }

  initState = () => {
    return api.adminCampusClassList().then(classList => ({ classList }))
  }

  initViewState = ({ modalParams }) => {
    return api.adminStudentDetail({ class_student_id: modalParams.class_student_id }).then(model => ({ model }))
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
    ['major', '学历专业', ({ model }) => model.degree != 7],
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
    renderItem: 'static'
  }))

  render() {
    const { uploadCSVError } = this.props
    return (
      <Page
        buttons={this.buttons}
        actions={actions}
        initState={this.initState}
        filters={this.getFilters()}
        columns={this.columns}
        selectId={i => i.class_student_id}
      >
        <FormModalStatic
          name="view"
          title="查看"
          initState={this.initViewState}
          modelFields={this.viewModelFields}
          onCancel={() => this.dispatch(actions.hideModal('view'))}
        />
        <FormModal
          name="batchAdd"
          title="批量报档"
          modelFields={[
            {
              field: 'file',
              formItemProps: {
                label: '选择文件',
                validateStatus: (uploadCSVError ? 'error' : ''),
                help: uploadCSVError && (
                  <div>
                    {uploadCSVError.split(';').map((msg, i) =>
                      <div key={i}>{msg}</div>
                    )}
                  </div>
                )
              },
              renderItem() { return <FileInput /> }
            },
            {
              field: 'template',
              formItemProps: {
                label: '',
              },
              renderItem() { return <div className="download" style={{ marginTop: -24, paddingLeft: 80 }}><span>提示：批量上传报档</span>&nbsp;&nbsp;<a href="http://rs-beijing.oss.yunpan.xxx.cn/Object.getFile/others/MzYw572R57uc5a6J5YWo5a2m6Zmi5a2m5ZGY5oql5qGj5qih5p2/Lnhsc3g=">模板下载</a></div>}
            }
          ]}
          onCancel={() => {
            this.dispatch(actions.hideModal('batchAdd'));
            this.dispatch(actions.setPageState({ uploadCSVError: false }))
          }}
          onSave={(values) => {
            api.adminStudentCreateByFile(values)
              .then(() => {
                Alert.info('添加成功')
                this.dispatch(actions.hideModal('batchAdd'))
                this.dispatch(actions.getPage())
              })
              .catch((e) => this.dispatch(actions.setPageState({ uploadCSVError: e.errmsg })))
          }}
        />
      </Page>
    )
  }
}).connect(state => {
  return ({ uploadCSVError: state.page.uploadCSVError, classList: (state.page || {}).classList })
})
