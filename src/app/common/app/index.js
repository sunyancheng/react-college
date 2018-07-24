
import React from 'react'
import Base from 'common/base'
import Alert from 'common/alert'
import { login } from './app-actions'
export default (class extends Base {
  componentDidMount() {
    this.dispatch(login())
  }

  renderApp = () => {
    const { children, isFreeze, isLogin } = this.props
    return !isFreeze ? (isLogin && children) : <div style={{ fontSize: 22 }}>该用户已被冻结</div>
  }

  render() {
    const { style, className } = this.props
    return (
      <div className={className} style={style || { height: '100%' }}>
        <Alert />
        {this.renderApp()}
      </div>
    )
  }
}).connect(state => {
  const { isLogin, isFreeze } = state.app
  return { isLogin, isFreeze }
})
