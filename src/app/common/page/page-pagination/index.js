import React from 'react'
import Base from 'common/base';
import { Pagination } from 'antd'
import './style.less'

export default (class extends Base {

  render() {
    const { page, pageSize, total } = this.props;
    if ([page, pageSize, total].includes(undefined)) return null;
    var pagination = {
      current: page, pageSize, total,
      showTotal: (total) =>
        <span>
          共
          <span className="highlight">&nbsp;{total}&nbsp;</span>
          条记录&nbsp;第
          <span className="highlight">&nbsp;{page}&nbsp;</span>
          /&nbsp;{Math.ceil(total / pageSize)}&nbsp;
          页
        </span>
      ,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100', '200'],
      onChange: this.props.onChange,
      onShowSizeChange: this.props.onChange
    };
    return (
      <div className="table-footer">
        <Pagination {...pagination} />
      </div>
    );
  }
}).connect(state => {
  var { page, pagesize, total } = state.page;
  return {
    page, pageSize: pagesize, total
  };
});
