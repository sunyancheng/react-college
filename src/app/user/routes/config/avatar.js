import React from 'react'
import { Button, Form } from 'antd'
import Portrait from 'common/portrait'
import api, { cachedApi } from 'common/api'
import Alert from 'common/alert'
import { updateUserDetail } from 'common/app/app-actions'
import Base from 'common/base'
import { baseURL } from 'common/request/config'

export default Form.create()(class extends Base {

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      api.updateUserAvatar(values)
        .then(() => {
          Alert.info('操作成功')
          this.dispatch(updateUserDetail(values))
          cachedApi.userDashboardInfoDetail.clear()
        })
        .catch(() => Alert.info('操作失败，请稍后再试'))
    });
  }

  render() {
    const { avatar } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div className="user-config__avatar-wrapper">
        <Form className="user-config-info__form">
          <Form.Item>
            {getFieldDecorator('avatar', {
              initialValue: avatar ? avatar : ''
            })(<Portrait action={`${baseURL}/home/user/user/user/upload-pic`} help accept=".jpg,.png,.bmp,.jpeg" description="2MB以内，jpg、png、bmp方形图片"/>)
            }
            <div style={{ clear: 'both', paddingTop: 40 }}>
              <Button onClick={this.handleSubmit} type="primary" className="btn btn-primary">保存修改</Button>
              <Button type="default" className="btn btn-default">取消</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    )
  }
}).connect(state => {
  const model = state.app.userInfo || {}
  return {
    avatar: model.avatar
  }
})
