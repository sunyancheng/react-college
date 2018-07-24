import React from 'react';
import './table-empty.less'
export default class extends React.Component {

  render() {
    let { className, list, ...rest } = this.props;
    if (!!list.length) {
      return null;
    }
    return (
      <div className={`big-table-empty-mask ${className}`} {...rest}>
        <div className="big-table-empty-bg"/>
        <div className="big-table-empty-desc">
          <div className="big-table-empty-desc-title">暂无数据</div>
        </div>
      </div>
    );
  }
}
