
import React from 'react'
import { TARGET_PIC } from 'common/config'
import { Menu, Dropdown } from 'antd';
import PropTypes from 'prop-types'
import './style.less';
var Graph;
class ContextMenu extends React.Component {

  static defaultProps = {
    // renderMenu: () => <Menu/>
  }

  handleClick = (key) => {
    if (key === 'delete') {
      this.props.onDeleteNode();
    }
    if (key === 'edit') {
      this.props.onEditNode();
    }
    if (key === 'link') {
      this.props.network.addEdgeMode()
    }
    if (key === 'deleteEdge') {
      this.props.onDeleteEdge()
    }
    this.props.hide()
  }

  enableEdit = (props) => !['platform', 'platform_user'].includes(props.selectedNode)

  getMenu = () => {
    if (this.props.static) {
      return <Menu />
    }
    if (this.props.readOnly) {
      return this.props.renderMenu ? this.props.renderMenu() : <Menu />
    }
    if (this.props.selectedNode) {
      return (<Menu onClick={({ key }) => this.handleClick(key)}>
        {this.enableEdit(this.props) && <Menu.Item key="edit">编辑节点</Menu.Item>}
        <Menu.Item key="link">添加连线</Menu.Item>
        {this.enableEdit(this.props) && <Menu.Item key="delete">删除节点</Menu.Item>}
      </Menu>);
    }
    if (this.props.selectedEdge) {
      return (<Menu onClick={({ key }) => this.handleClick(key)}>
        <Menu.Item key="deleteEdge">删除连线</Menu.Item>
      </Menu>
      );
    }
    return <Menu />
  }

  render() {
    let { children, readOnly } = this.props;
    let menu = this.getMenu();
    return (
      <Dropdown
        visible
        overlay={menu}
        style={{ minWidth: 0, width: 100 }}
        getPopupContainer={() => document.querySelector('.drop-content-component')}
        placement="bottomLeft"
        trigger={[!readOnly ? 'contextMenu' : 'click']}
      >
        <div>
          {children}
        </div>
      </Dropdown>
    );
  }
}

class Scene extends React.Component {
  static defaultProps = {
    readOnly: false,
    onAddNode: () => { },
    onEditNode: () => { },
    onDeleteNode: () => { },
    onClick: () => { }
  }

  static propTypes = {
    setTopoNetwork: PropTypes.func.isRequired
  }

  state = {
    graphLoaded: false
  }
  componentDidMount() {
    import(/* webpackChunkName: "react-graph-vis" */ 'react-graph-vis').then((g) => {
      Graph = g.default;
      this.setState({ graphLoaded: true })
    })
  }

  showMenu = (menu, x, y, node, marginLeft = 0) => {
    if (menu) {
      menu.style.visibility = `visible`;
      menu.style.left = `${x}px`
      menu.style.top = `${y}px`
      menu.style.marginLeft = `${marginLeft}`
      this.node = node;
    }
  }

  hideMenu = (menu) => {
    if (menu) {
      menu.style.left = `-9999px`
      menu.style.top = `-9999px`
    }
  }

  enableEdit = (node) => !['platform', 'platform_user'].includes(node)

  handleOperateNode = ({ network, node, pointer }) => {
    network.selectNodes([node]);
    this.props.onSetSelectedNode(node);
    this.props.onSetSelectedEdge('');
    this.node = node;
    let dropdownMenu = document.querySelector('.drop-content-component .ant-dropdown');
    this.showMenu(dropdownMenu, pointer.DOM.x + 20, pointer.DOM.y, node);
  }
  handleDoubleClickNode = ({ e, network, node }) => {
    network.selectNodes([node]);
    this.props.onSetSelectedEdge('');
    this.node = node;
    if (!this.enableEdit(node)) {
      return e.preventDefault();
    }
    this.props.onDoubleClickEdit(node)
  }
  handleOperate = (event, doubleClick = false) => {
    let { pointer, event: e } = event;
    let { network, readOnly } = this.props;
    if (readOnly) return e.preventDefault();
    let node = network.getNodeAt(pointer.DOM);
    let edge = network.getEdgeAt(pointer.DOM);
    if ((!node && !edge)/* || node === 'platform' || node === 'platform_user' || edge === 'default_edge'*/) {
      e.preventDefault();
      e.cancelBubble = true;
      this.node = node;
    } else if (node) {
      if (!doubleClick) {
        this.handleOperateNode({ network, node, pointer })
      } else {
        this.handleDoubleClickNode({ e, network, node })
      }
    } else if (edge) {
      network.selectEdges([edge]);
      this.props.onSetSelectedNode('');
      this.props.onSetSelectedEdge(edge);
      let dropdownMenu = document.querySelector('.drop-content-component .ant-dropdown');
      this.showMenu(dropdownMenu, pointer.DOM.x + 20, pointer.DOM.y, edge);
    }
  }

  events = {
    oncontext: (event) => this.handleMenu(event),
    click: (event) => {
      if (this.props.static) return;
      let { network, readOnly } = this.props;
      let { pointer } = event;
      let node = network.getNodeAt(pointer.DOM)
      let dropdownMenu = document.querySelector('.drop-content-component .ant-dropdown');
      if (!node) {
        this.hideMenu(dropdownMenu);
      }
      if (node && readOnly) {
        this.props.onClick(node, () => this.showMenu(dropdownMenu, pointer.DOM.x - 80, pointer.DOM.y + 60, node), () => this.hideMenu(dropdownMenu));
      }
    },
    doubleClick: (event) => {
      this.handleOperate(event, true)
    }
  };

  handleMenu = (event) => {
    this.handleOperate(event)
  }

  options = {
    physics: { enabled: true },
    autoResize: true,
    layout: {
      hierarchical: {
        enabled: this.props.readOnly,
        direction: 'LR'
      }
    },
    interaction: { hover: true },
    manipulation: {
      controlNodeStyle: {
        shape: 'dot',
        size: 6,
        color: {
          background: '#ff0000',
          border: '#3c3c3c',
          highlight: {
            background: '#07f968',
            border: '#3c3c3c'
          }
        },
        borderWidth: 2,
        borderWidthSelected: 2
      },
      addEdge: (edgeData, _) => {
        this.props.onAddEdge(edgeData)
      }
    },
    nodes: {
      fixed: {
        x: this.props.readOnly,
        y: this.props.readOnly
      },
      borderWidth: 10,
      borderWidthSelected: 20,
      // physics: false,
      chosen: {
        label: (values) => {
          values.color = '#347567'
          // values.strokeColor = '#347567'
          values.size = '14'
          values.strokeWidth = 3
        },
        node: (values) => {
          values.borderWidth = '10px';
          values.borderColor = '#ff0';
          // values.shadow = true;
          // values.shadowColor = 'red';
        }
      }
    },
    edges: {
      arrows: {
        to: { enabled: false, scaleFactor: 1, type: 'arrow' },
        middle: { enabled: false, scaleFactor: 1, type: 'arrow' },
        from: { enabled: false, scaleFactor: 1, type: 'arrow' }
      },
      color: {
        color: '#347567',
        highlight: '#347567',
        hover: '#347567',
        inherit: 'from',
        opacity: 1.0
      },
      width: 2,
      smooth: {
        enabled: true,
        type: "dynamic",
        roundness: 0.5
      },
      selfReferenceSize: 0
      // dashes: true
    }
  };

  getNodes = (targetNodes) => {
    return targetNodes.map((item) => ({
      ...item,
      id: item.id || `${item.target_id}-${targetNodes.filter(node => node.detail_type === item.detail_type).length + 1}`,
      label: item.name,
      shape: 'image',
      font: '12px PingFangSC-Regular #ffffff',
      image: {
        unselected: this.getNodeImage(item.detail_type),
        // selected: this.getNodeImage(item.detail_type + '1')
      }
    }));
  }

  getNodeImage = (detail_type) => (TARGET_PIC.find(target => target.type == detail_type) || TARGET_PIC[0]).pic_url

  render() {
    if (!this.state.graphLoaded) return null;
    const { targetEdges = [], targetNodes = [], readOnly } = this.props

    let dropdownMenu = document.querySelector('.drop-content-component .ant-dropdown');
    let nodes = this.getNodes(targetNodes);
    let graphProps = {
      graph: { nodes, edges: targetEdges },
      options: this.options,
      getNetwork: (network) => this.props.setTopoNetwork(network),
      events: this.events,
    }
    return (
      <div className="drop-content-component" ref={c => this.container = c}>
        <ContextMenu {...this.props} readOnly={readOnly} refs={() => this.container} hide={() => this.hideMenu(dropdownMenu)}>
          <Graph {...graphProps} />
        </ContextMenu>
      </div>
    )
  }
}
export default Scene
