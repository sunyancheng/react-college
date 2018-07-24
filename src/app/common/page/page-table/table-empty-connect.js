import React from 'react';
import Base from 'common/base';
import TableEmpty from './table-empty';
export default (class extends Base {
  render() {
    return <TableEmpty list={this.props.list} />
  }
}).connect(state => ({ list: state.page.list }));
