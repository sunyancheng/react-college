import React from 'react'
import './style.less'
import { Tree } from 'antd'
const TreeNode = Tree.TreeNode;
import PropTypes from 'prop-types'

export default class extends React.Component {
  static propTypes = {
    getLabel: PropTypes.func,
    getValue: PropTypes.func,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    onChange: () => {}
  }

  renderTreeNodes = (data) => {
    if (!data || data.length === 0) return null;
    const { getLabel, getValue } = this.props
    return [].concat(data).map((item) =>
      <TreeNode title={getLabel(item)} key={getValue(item)} data={item}>
        {this.renderTreeNodes(item.children)}
      </TreeNode>
    );
  }
  render() {
    const { onChange, value, options, ...rest } = this.props
    return (
      <Tree
        {...rest}
        checkable
        onCheck={(...args) => onChange(...args)}
        checkedKeys={value}
        className="tree2"
      >
        {this.renderTreeNodes(options)}
      </Tree>
    );
  }
}
