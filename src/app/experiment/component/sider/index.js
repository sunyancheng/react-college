import Base from 'common/base'
import React from 'react'
import Pdf from 'common/pdf-viewer';
import './style.less'

export default class extends Base {
  getUrl = () => this.props.url
  render () {

    return (
      <div className="experiment-sider-component">
        <h3>实验手册</h3>
        <div className="content-container">
        {!this.getUrl() ? <p>暂无内容</p> : <Pdf scale={2.5} url={this.getUrl()}/>}
        </div>
      </div>
    );
  }
}