import React from 'react';

export default class extends React.Component {
  static defaultProps = {
    key: ''
  }
  render() {
    const isRoot = this.props.hasOwnProperty('isRoot');
    const rootClassName = isRoot ? ' tree-table__header' : '';
    return (
      <div className={'tree-table__node ' + rootClassName}>
        {this.props.children}
      </div>);
  }
}
