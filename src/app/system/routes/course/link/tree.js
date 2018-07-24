import React from 'react'
import PropTypes from 'prop-types'
import { BtnGroup, Btn } from 'common/button-group'
import { TreeSelect } from 'antd'

export default class extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    options: PropTypes.array,
    config: PropTypes.object
  }

  state = {
    value: []
  }

  componentWillMount() {
    const options = this.props.options
    const res = {}
    this.mapToObj(options, res)
    this.setState({
      value: this.props.value,
      optionsFlat: res
    })
  }

  mapToObj = (options, res) => {
    options.forEach(opt => {
      return opt.type == 1
        ? res[opt.value] = opt
        : this.mapToObj(opt.children, res)
    })
  }

  goUp = (i) => () => {
    const { value } = this.state
    const temp = value[i - 1]
    value[i - 1] = value[i]
    value[i] = temp
    this.onChange(value)
  }

  goDown = (i) => () => {
    const { value } = this.state
    const temp = value[i + 1]
    value[i + 1] = value[i]
    value[i] = temp
    this.onChange(value)
  }

  onSelectChange = (_, treeNode) => {
    const folders = {}
    const node = treeNode.props.node

    const recursive = (nodes, cb) => {
      nodes = [].concat(nodes)
      nodes.forEach(node => {
        cb(node)
        if (node.children)
          recursive(node.children, cb)
      })
    }
    var selectedMap = this.getSelectedMap()
    const checked = !treeNode.props.checked
    recursive(node, (n) => {
      if(n.type == 1)
        return selectedMap[n.value] = checked
      folders[n.value] = true
    }) // 把节点选中情况分别放到不同类型的数组中
    let currentValue = this.state.value
    const temp = currentValue.slice()
    currentValue.forEach(v => {
      if (!selectedMap[v])
        temp.splice(temp.indexOf(v), 1)
    })
    currentValue = temp
    Object.keys(selectedMap).filter(k => selectedMap[k] && !folders[k])
      .forEach(v => {
      if (!currentValue.includes(v)) {
        currentValue.push(v)
      }
    })
    // this.onChange(currentValue)
  }

  getSelectedMap() {
    return this.state.value.reduce((obj, id) => ({ ...obj, [id]: true }), {})
  }

  onChange = (value) => {
    this.setState({
      value
    })
    this.props.onChange(value)
  }

  delete = (i) => () => {
    const { value } = this.state
    value.splice(value.indexOf(value[i]), 1)
    this.onChange(value)
  }

  renderRow = (item, index) => {
    const { optionsFlat } = this.state
    return (
      <div className="course-link__panel__row" key={index}>
        <span className="course-link__panel__row-label">{index + 1}：{optionsFlat[item].label}</span>
        <BtnGroup>
          <Btn onClick={this.goUp(index)} disabled={index == 0}>上移</Btn>
          <Btn onClick={this.goDown(index)} disabled={index == this.state.value.length - 1}>下移</Btn>
          <Btn onClick={this.delete(index)}>删除</Btn>
        </BtnGroup>
      </div>
    )
  }

  renderNodes(nodes) {
    if (!nodes || nodes.length === 0) {
      return null
    }
    return nodes.map((node) =>
      <TreeSelect.TreeNode node={node} value={node.value}
        title={node.label} key={node.value}
      >
        {this.renderNodes(node.children)}
      </TreeSelect.TreeNode>
    )

  }

  render() {
    const { options } = this.props
    const { value, optionsFlat } = this.state
    return (
      <div>
        <TreeSelect dropdownStyle={{maxHeight: 250}} multiple value={value}
          onSelect={this.onSelectChange}
          onChange={this.onChange}
          treeCheckable={true}
          showCheckedStrategy={TreeSelect.SHOW_CHILD}
          treeNodeLabelProp={'value'}
        >
          {this.renderNodes(options)}
        </TreeSelect>
        <div className="course-link__panel">
          {
            value
              .filter(id => optionsFlat[id])
              .map((item, i) => this.renderRow(item, i))
          }
        </div>
      </div>
    )
  }
}
