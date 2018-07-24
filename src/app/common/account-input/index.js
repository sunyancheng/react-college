import React from 'react'
import { Input, Form } from 'antd'
import api from 'common/api'
import PropTypes from 'prop-types'
export default class extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired
  }
  static defaultProps = {
    method: "adminCheckPhoneAccount"
  }

  state = {}

  componentDidMount() {
    if (this.props.defaultValue) {
      this.check({ account: this.props.defaultValue }).then(({ user }) => {
        if (user)
          this.setState({ info: `姓名：${user.name}, 昵称：${user.nickname}` })
      })
    }
  }

  check ({ account }) {
    return api[this.props.method]({account})
  }

  render() {
    const { formItemProps, form, defaultValue, notRequired, disabled = false } = this.props
    return (
      <div>
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 19 }}
          hasFeedback
          label="平台账号"
          required={!notRequired}
          {...formItemProps}
          help={this.state.info}
        >
          {form.getFieldDecorator('account', {
            validateFirst: true,
            validateTrigger: 'onBlur',
            initialValue: defaultValue,
            rules: [
              {
                validator: (rule, value, callback) => {
                  const failed = info => {
                    this.setState({ info })
                    callback(info)
                  }
                  const success = info => {
                    this.setState({ info })
                    callback()
                  }

                  if (notRequired && !value) return success()

                  if (!notRequired && !value) return failed('平台账号不能为空')
                  if (!/^1[3456789]\d{9}$/.test(value)) return failed('请填写正确手机号')
                  this.check({ account: value }).then(({ user }) => {
                    if (!user) return failed('平台账号不存在')
                    form.setFieldsValue({ user_id: user.user_id })
                    success(`账号名称：${user.name}，账号昵称：${user.nickname}`)
                  }).catch(() => failed('验证失败，请稍后再试！'))

                }
              }
            ]
          })(<Input disabled={disabled} placeholder="请输入注册手机号" />)
          }
        </Form.Item>

        <Form.Item style={{ display: 'none' }}>
          {form.getFieldDecorator('user_id', {})(<Input />)}
        </Form.Item>
      </div>
    )
  }
}
