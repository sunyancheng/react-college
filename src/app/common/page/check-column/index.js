// checkbox-header and checkbox-row is for performance reason, so that when we click the checkbox table is not need to render
import React from 'react'
import Base from 'common/base';
import { Checkbox } from 'antd';

export const CheckboxHeader = (class extends Base {
  handleOnchange = () => {
    const { checkedAll, rows, selectCheckData } = this.props
    if (checkedAll) {
      this.props.onCheckedRowsChanged({ checkedAll: false, checkedRows: [] })
      return
    }
    this.props.onCheckedRowsChanged({ checkedAll: true, checkedRows: rows.map(selectCheckData) })
  }
  render() {
    const { checkedAll } = this.props;
    return (
      <Checkbox checked={checkedAll} onChange={this.handleOnchange} />
    );
  }
}).connect(state => ({ checkedRows: state.page.checkedRows, checkedAll: state.page.checkedAll }));

export const CheckboxRow = (class extends Base {
  render() {
    const { checkedRows, row, selectCheckData } = this.props;
    return (
      <Checkbox checked={checkedRows.includes(selectCheckData(row))} onClick={(e) => e.stopPropagation()} onChange={() => { this.props.onCheck(selectCheckData(row)) }} />
    );
  }
}).connect(state => ({ checkedRows: state.page.checkedRows || [] }));
