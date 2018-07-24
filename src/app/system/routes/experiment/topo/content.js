import React from 'react';
import Base from 'common/base'
import { DropTarget } from 'react-dnd'
import ExperimentScene from 'common/experiment-scene'

const targetTarget = {
	drop() {
		return { name: 'Scene' }
	},
}
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),
  };
}

class Scene extends Base {
  render () {
    let { connectDropTarget } = this.props;
    return connectDropTarget(<div style={{  height: '100%' }}><ExperimentScene {...this.props}/></div>);
  }
}

export default DropTarget('target', targetTarget, collect)(Scene.connect(state => state));