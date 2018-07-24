import React from 'react';
import { Form, Input, Button, DatePicker, Cascader } from 'antd';
const FormItem = Form.Item;
import { RadioGroup2 } from 'common/radio-group'
import { GENDER } from 'common/config'
import Provinces from 'common/config/provinces'
import api, { cachedApi } from 'common/api'
import moment from 'moment'
import Alert from 'common/alert'
import { updateUserDetail } from 'common/app/app-actions'
import Base from 'common/base'
import { momentToString } from 'common/page/form-modal/form'

const momentize = (modalParams, fields, dateFormat = 'YYYY-MM-DD') => {
  const newModal = { ...modalParams }
  fields.map(field => {
    newModal[field] = newModal[field] && moment(newModal[field], dateFormat)
  })
  return newModal
}

export default Form.create()(class InfoForm extends Base {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const convert = momentToString(values)
        const ret = { ...convert, live_city: convert.live_city ? convert.live_city.join(',') : '' }
        api.userRegister(ret)
          .then(() => {
            Alert.info('操作成功')
            this.dispatch(updateUserDetail({ ...ret, nick_name: values.nickname }))
            cachedApi.userDashboardInfoDetail.clear()
          })
          .catch(() => Alert.error('操作失败，请稍后再试'))
      }
    })
  }

  render() {
    let { model } = this.props
    model = momentize(model, ['birthday'])
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      className: 'label'
    };
    return (
      <div className="user-config-info" ref={(ref) => this.formContainer = ref}>
        <Form onSubmit={this.handleSubmit} className="user-config-info__form">
          <FormItem
            {...formItemLayout}
            label="姓名"
          >
            {getFieldDecorator('name', {
              initialValue: model ? model.name : '',
              rules: [
                { required: true, message: '请输入姓名' },
                { pattern: /^[\S\s]{1,40}$/, message: '姓名应为1-40个字符' }
              ],
            })(<Input disabled={!model.is_change_name} placeholder="请输入" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="昵称"
          >
            {getFieldDecorator('nickname', {
              initialValue: model ? model.nickname : '',
              rules: [
                { required: true, message: '请输入昵称' },
                { pattern: /^[\S\s]{1,14}$/, message: '昵称应为1-14个字符' }
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="性别"
          >
            {getFieldDecorator('gender', {
              initialValue: model ? model.gender : '1',
              rules: [{ required: true, message: '请选择性别', }],
              validateTrigger: 'onChange'
            })(<RadioGroup2 options={GENDER} getValue={i => i.value} getLabel={i => i.label} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="生日"
          >
            {getFieldDecorator('birthday', { initialValue: model ? model.birthday : '' })(
              <DatePicker onChange={() => { }} placeholder="请选择日期" style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="城市"
          >
            {getFieldDecorator('live_city', { initialValue: model ? (model.live_city ? model.live_city.split(',') : '') : '', })(
              <Cascader getPopupContainer={() => this.formContainer} placeholder="请选择位置" options={Provinces} showSearch />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="邮箱"
          >
            {getFieldDecorator('mail', {
              initialValue: model ? model.mail : '',
              rules: [{ type: 'email', message: '请输入正确格式的邮箱' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="签名"
          >
            {getFieldDecorator('signature', {
              initialValue: model ? model.signature : '',
              rules: [{ pattern: /^[\S\s]{1,50}$/, message: '签名应为1-50个字符' }]
            })
              (<Input.TextArea placeholder="快来设置一个响亮的个性签名吧~" />)}
          </FormItem>
          <FormItem {...formItemLayout}>
            <Button type="primary" htmlType="submit" className="btn btn-primary" style={{ marginLeft: 120 }}>保存修改</Button>
            <Button type="default" className="btn btn-default" onClick={() => this.props.history.replace('info')}>取消</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}).connect(state => {
  const model = state.app.userInfo || {}
  return {
    model
  }
})
