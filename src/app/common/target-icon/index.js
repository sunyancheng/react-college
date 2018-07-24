import React from 'react';
import './style.less'

class TargetIcon extends React.Component {
  render () {
    return (
      <div data-name={this.props.title} className={`target-icon-container icon-${this.props.type}`}/>
    );
  }
}

class TargetIconBlock extends React.Component {
  render () {
    return (
      <div className={`target-icon-block`}><TargetIcon {...this.props}/></div>
    );
  }
}
export { TargetIcon, TargetIconBlock };
export default TargetIcon;