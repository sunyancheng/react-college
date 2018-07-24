import React from 'react';
import './style.less'
export default class extends React.Component {
  render () {
    let { level, config } = this.props;
    let current = config.find(item => item.value === level) || {};
    return (
      <div className="level-bar-component" style={{ color: current.color }}>
        <span>{current.label}</span>
        {[...Array(level/1 || 0)].map((item, i) => <div key={i} className="item"/>)}
      </div>
    );
  }
}