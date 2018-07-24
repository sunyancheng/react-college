import Base from 'common/base';
import React from 'react';
import BTable from './table';
import TableLoading from './table-loading-connect';
import TableEmpty from './table-empty-connect'
import { CheckboxHeader, CheckboxRow } from 'common/page/check-column';

export default (class extends Base {
  static defaultProps = {
    selectCheckData: i => i
  }

  handlePageChange = (state) => this.dispatch(this.props.actions.setPageState(state))
  handleCheckedRowsChanged = ({ checkedRows, checkedAll }) => this.dispatch(this.props.actions.setPageState(({ checkedRows, checkedAll })))
  handleClickRow = (rowData) => {
    const { data, actions } = this.props
    this.dispatch(actions.checkRow(rowData), actions.setCheckAll(data.length))
  }

  getCheckColumn(rows = []) {
    return {
      title: (
        <div style={{ height: '18px' }}>
          <CheckboxHeader
            rows={rows}
            selectCheckData={this.props.selectCheckData}
            onCheckedRowsChanged={this.handleCheckedRowsChanged}
          /></div>
      ),
      key: "@checkbox",
      width: 100,
      fixed: 'left',
      headerStyle: { textAlign: 'center' },
      cellStyle: { textAlign: 'center' },
      render: (record) => (
        <CheckboxRow
          row={record}
          onCheck={this.handleClickRow}
          selectCheckData={this.props.selectCheckData}
        />
      )
    }
  }

  render() {
    var { columns, data, selectId, checkColumn, onClickRow, getContainer } = this.props;
    if (!columns) return null;
    if (checkColumn) {
      columns = [this.getCheckColumn(data), ...columns]
    }
    return (
      <BTable
        data={data}
        columns={columns}
        selectId={selectId}
        onClickRow={onClickRow}
        getContainer={getContainer}
      >
        <TableLoading />
        <TableEmpty />
      </ BTable>
    );
  }
}).connect(state => {
  const { list: data, checkedRows } = state.page
  return {
    data,
    checkedRows
  }
})
