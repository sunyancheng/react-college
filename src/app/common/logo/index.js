import React from 'react'
import './style.less'

class Logo extends React.Component {
  static defaultProps = {
    platform: '学习平台',
  }
  render() {
    const light = 'https://p3.ssl.qhimg.com/t013b43d5701fe06035.png'
    const dark = 'https://p3.ssl.qhimg.com/t013b43d5701fe06035.png'
    const { lighter, platform, ...rest } = this.props
    return (
      <div {...rest} className="tr-logo">
        <img src={lighter ? light : dark} alt="360网络安全学院" />
        <span className="tr-logo-flag">{platform}</span>
      </div>
    )
  }
}

export default Logo
