import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import TargetIcon from 'common/target-icon'

const targetSource = {
	beginDrag(props) {
		return {
			name: props.name,
		}
	},

	endDrag(props, monitor) {
		const dropResult = monitor.getDropResult()
		if (dropResult) {
			props.onDragEnd();
		}
	},
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class Target extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		isDragging: PropTypes.bool.isRequired,
	}

	render() {
		const { connectDragSource } = this.props
		const { target: item } = this.props
		return connectDragSource(<div><TargetIcon title={item.name} type={item.detail_type} /></div>)
	}
}
export default DragSource('target', targetSource, collect)(Target);