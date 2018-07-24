import React from 'react'
import { Tree } from 'antd'

export default class extends React.Component {

  static Proptypes = {

  }

  onCheck = (checkKeys) => {
    const parents = ['1', '2', '4']
    const filter = ['1', '2']
    const p = checkKeys.filter(k => filter.includes(k))
    const c = checkKeys.filter(k => !parents.includes(k))
    const res = p.map(v => ({ user: v }))
    if (c.length > 0) {
      res.push({user:'4', list: c})
    }
    this.props.onChange(res)
  }

  isRoot = (node) => {
    return !!node.node.user
  }

  renderNodes(nodes, id, parent) {
    if (!nodes || nodes.length === 0) {
      return null
    }
    return nodes.map((node) => {
      return (
        <Tree.TreeNode
          parent={parent.user}
          // selectable={false}
          // disableCheckbox={level == 1}
          node={node}
          title={node.name}
          key={node[id]}
        >
          {this.renderNodes(node.list, 'campus_id', node)}
        </Tree.TreeNode>
      )
    })
  }

  calcuDefaultCheckedKeys = (value=[]) => {
    return value.map(item => item.list ? item.list: item.user).reduce((obj, item ) => obj.concat(item) , [])
  }

  render() {
    const { options, value } = this.props
    const checkedKeys = this.calcuDefaultCheckedKeys(value)
    return (
      <Tree
        showLine
        checkable
        checkedKeys={checkedKeys}
        defaultExpandedKeys={checkedKeys}
        onCheck={this.onCheck}
      >
        {this.renderNodes(options, 'user', { user: 0 }, 1)}
      </Tree>
    )
  }
}
