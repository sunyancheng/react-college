import React from 'react';
import Base from 'common/base';
import TableLoading from './table-loading';
export default (class extends Base {
  render() {
    return <TableLoading loading={this.props.loading} />
  }
}).connect(state => ({ loading: state.page.loading }));