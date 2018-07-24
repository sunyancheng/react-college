import Loading from 'common/loading-icon';
import React from 'react';
export default class extends React.Component {
  render() {
    if (!this.props.loading) {
      return null;
    }
    return (
      <div>
        <div className="big-table-loading-mask" />
        <div className="big-table-loading-wrapper">
          <Loading />
        </div>
      </div>
    );
  }
}
