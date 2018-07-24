import React from 'react';

export default class extends React.Component {
  static defaultProps = {
    key: ''
  }
  render() {

    let className = 'hide';
    if (!this.props.hasOwnProperty('root')) {
      if (this.props.foldable) {
        className = this.props.isFolded ? 'guide--collapse' : 'guide--expand';
      }
      else {
        className = '';
      }
    }
    return (
      <div className={'tree-table__row ' + this.props.className} key={this.props.key}>
        <div className={'guide-line ' + className}>
          <div className="line-v" />
          <div className="cross-wrap" onClick={this.props.onFold}>
            <div className="cross-v" />
            <div className="cross-h" />
          </div>
          <div className="line-h" />
        </div>
        {this.props.children}
      </div>);
  }
}
