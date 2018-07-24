import TableTree from 'common/table-tree'
import React from 'react'
import './table-tree-wrapper.less'
const Wrapper = props => {
  return (
    <div className="table-tree-wrapper">
      <TableTree {...props} />
    </div>
  )
}

Wrapper.Row = props => {
  return (<div className="table-tree-wrapper__row" >{props.children}</div>)
}
Wrapper.Column = props => {
  var style = props.style || {}
  if (props.width) {
    style.width = props.width + 'px'
  }
  var className = props.fill ? (props.fileFlag ? "table-tree-wrapper__column-file" : "table-tree-wrapper__column") : ''
  return (
    <div className={className} style={style}>{props.children}</div>
  )
}
export default Wrapper