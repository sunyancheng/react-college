import React from 'react';

export default class extends React.Component {
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
      <div className={'tree-table__row ' + this.props.className}>
        {!this.props.root &&
          <div className={'guide-line ' + className}>
            <div className="line-v" />
            <div className="circle-wrap" onClick={this.props.onFold}>
              <div className="circle">
                <div className="circle-v" />
                <div className="circle-h" />
              </div>
            </div>
            <div className="line-h" />
          </div>
        }
        {this.props.children}
      </div>);
  }
}
