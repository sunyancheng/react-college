import React from 'react';
import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;

export default Form.create()(class InfoForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
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
      <Form onSubmit={this.handleSubmit} className="user-config-info__form">
        <FormItem
          {...formItemLayout}
          label="手机号码"
        >
          {getFieldDecorator('phone', {
            rules: [{
              required: true, message: '请输入手机号',
            }, { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="原始密码"
        >
          {getFieldDecorator('opassword', {
            rules: [{
              type: 'opassword', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="新设密码"
        >
          {getFieldDecorator('npassword', {
            rules: [{
              type: 'npassword', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="确认密码"
        >
          {getFieldDecorator('cpassword', {
            rules: [{
              type: 'cpassword', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem {...formItemLayout}>
          <Button type="primary" htmlType="submit" className="btn btn-primary" style={{ marginLeft: 120 }}>保存修改</Button>
          <Button type="default" className="btn btn-default" onClick={() => this.props.history.replace('account')}>取消</Button>
        </FormItem>
      </Form>
    );
  }
});
