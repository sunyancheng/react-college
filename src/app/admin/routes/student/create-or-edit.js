import React from 'react'
import Base from 'common/base'
import FormModal from 'common/page/form-modal'
import { DatePicker, Cascader, Input } from 'antd'
import { RadioGroup2 } from 'common/radio-group'
import { Select2 } from 'common/select'
import { GENDER, ID_TYPE, EDUCATION_BACKGROUND, WORKING_STATUS, DISABLED_STUDENT_STATUS } from 'common/config'
import Provinces from 'common/config/provinces'
import api from 'admin/api'
import Breadcrumb from 'common/breadcrumb'
import AccountInput from 'common/account-input'

const isUnEdit = (status, condition) => {
  if (condition.some(v => v.value === status)) {
    return false
  }
  return true
}

export default (class extends Base {
  getModelFields(disableAccountInput) {
    return [
      {
        field: 'name',
        formItemProps: {
          label: '学员姓名'
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '学员姓名不能为空' },
          ],
        },
      }, {
        field: 'gender',
        formItemProps: {
          label: '性别',
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '性别不能为空' }
          ],
          validateTrigger: 'onChange',
        },
        renderItem() {
          return <RadioGroup2 options={GENDER} getValue={({ value }) => value} getLabel={({ label }) => label} />
        }
      }, {
        field: 'pinyin',
        formItemProps: {
          label: '姓名拼音'
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '姓名拼音不能为空' },
            { pattern: /^[\sa-zA-Z]+$/, message: '请正确填写姓名拼音' },
          ],
        },
      }, {
        field: 'student_id',
        formItemProps: {
          label: '学员学号'
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '学员学号不能为空' },
          ],
        },
      }, {
        field: 'id_type',
        formItemProps: {
          label: '证件类型'
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '证件类型不能为空' },
          ],
        },
        renderItem() {
          return <Select2 options={ID_TYPE} />
        }
      }, {
        field: 'id_no',
        formItemProps: {
          label: '证件号码'
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '证件号码不能为空' },
          ],
        },
      }, {
        render({ props, state }) {
          return <AccountInput method="deanCheckPhoneAccount" disabled={disableAccountInput} defaultValue={state.model && state.model.account} form={props.form} formItemProps={{ labelCol: { span: 5 }, wrapperCol: { span: 17 } }} />
        }
      }, {
        field: 'degree',
        formItemProps: {
          label: '最高学历'
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '最高学历不能为空' },
          ],
        },
        renderItem() {
          return <Select2 options={EDUCATION_BACKGROUND} />
        }
      }, {
        field: 'class_id',
        formItemProps: {
          label: '报名班级'
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '报名班级不能为空' }
          ],
        },
        renderItem: ({ state }) => {
          const isUnEdiable = isUnEdit(state.model.user_status, DISABLED_STUDENT_STATUS)
          return <Select2 disabled={this.props.disableClassOptions && isUnEdiable} options={state.classList} getValue={i => i.class_id} getLabel={i => `${i.name}（${i.major_name}）`} />
        }
      }, {
        field: 'major',
        condition({ props, model }) {
          const degree = props.form.getFieldValue('degree') || model.degree
          return degree != 7
        },
        formItemProps: {
          label: '学历专业'
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '所学专业不能为空' },
          ],
        },
      }, {
        field: 'school', condition({ props, model }) {
          const degree = props.form.getFieldValue('degree') || model.degree
          return degree != 7
        },
        formItemProps: {
          label: '毕业学校'
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '毕业学校不能为空' },
          ],
        },
      }, {
        field: 'graduation_date', condition({ props, model }) {
          const degree = props.form.getFieldValue('degree') || model.degree
          return degree != 7
        },
        formItemProps: {
          label: '毕业时间'
        },
        fieldDecorator: {
          validateTrigger: 'onChange',
          rules: [
            { required: true, message: '毕业时间不能为空' },
          ],
        },
        renderItem() {
          return <DatePicker format="YYYY-MM-DD" />
        }
      }, {
        field: 'status',
        formItemProps: {
          label: '工作状态'
        },
        fieldDecorator: {
          rules: [
            { required: true, message: '工作状态不能为空' },
          ],
        },
        renderItem() {
          return <Select2 options={WORKING_STATUS} />
        }
      }, {
        field: 'mail',
        formItemProps: {
          label: '联系邮箱'
        },
        fieldDecorator: {
          rules: [
            { type: 'email', required: true, message: '请填写正确邮箱' }
          ],
        }
      }, {
        field: 'id_city',
        formItemProps: {
          label: '户籍城市'
        },
        fieldDecorator: {
          validateTrigger: 'onChange',
          rules: [
            { type: 'array', required: true, message: '户籍城市不能为空' }
          ],
        },
        renderItem() {
          return <Cascader placeholder="请选择" options={Provinces} showSearch />
        }
      }, {
        field: 'live_city',
        formItemProps: {
          label: '所在城市'
        },
        fieldDecorator: {
          validateTrigger: 'onChange',
          rules: [
            { type: 'array', required: true, message: '所在城市不能为空' }
          ],
        },
        renderItem() {
          return <Cascader placeholder="请选择" options={Provinces} showSearch />
        }
      }, {
        field: 'memo',
        formItemProps: {
          label: '备注'
        },
        renderItem() {
          return <Input.TextArea autosize={{ minRows: 2 }} />
        }
      }
    ]
  }


  initState = (props, momentize) => {
    return Promise.all([
      api.adminCampusClassList(),
      Promise.resolve(this.props.model())
    ]).then(([classList, model]) => {
      return { classList, model: momentize(model, ['graduation_date']) }
    })
  }

  handleSave = (values) => {
    ['id_city', 'live_city'].forEach(name => {
      if (Array.isArray(values[name])) {
        values[name] = values[name].join(',')
      }
    })
    this.props.onSave(values).then(this.goBack)
  }

  goBack = () => this.props.history.push('/student')

  render() {
    return (
      <FormModal
        isPage
        title={<Breadcrumb />}
        onSave={this.handleSave}
        onCancel={this.goBack}
        initState={this.initState}
        modelFields={this.getModelFields(this.props.disableAccountInput)}
      />
    );
  }
}).connect((state) => {
  return state
}).withRouter()
