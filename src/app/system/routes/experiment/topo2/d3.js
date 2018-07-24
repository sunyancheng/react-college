import React from 'react';
import Base from 'common/base';
import * as d3 from 'd3';
import './d3.less';
import throttle from 'lodash/throttle'
import { NODE_TYPES } from './targets-config';
import { Menu, Dropdown } from 'antd';

class ContextMenu extends React.Component {
  menu = (
    <Menu>
      <Menu.Item key="1" onClick={()=>this.props.dispatch(this.props.actions.showModal('target'), {})}>编辑节点</Menu.Item>
      <Menu.Item key="2">添加连线</Menu.Item>
      <Menu.Item key="3">删除</Menu.Item>
    </Menu>
  );
  render () {
    let { children, refs } = this.props;
    return (
      <Dropdown overlay={this.menu} getPopupContainer={() => refs()} placement="bottomLeft" trigger={['contextMenu']}>
        { children }
      </Dropdown>
    );
  }
}

const imageStyle = {
  'width': 54,
  'height': 48,
};
const textStyle = {
  'x': 26,
  'y': 58
};
const lineStyle = (d) => {
  if(!d.source.x) return {};
  return {
    'strokeWidth': 2,
    'x1':  d.source.x + 26,
    'y1': d.source.y + 24,
    'x2': d.target.x + 26,
    'y2': d.target.y + 24,
  }
};

const nodeStyle = (node) => {
  if (!node.x) return {}
  return {
    'transform': `translate(${node.x}, ${node.y})`
  }
}

export default (class extends Base {
  static defaultProps = {
    targets: [],
    targetNodes: [],
    nodes: [[...Array(5).keys()].reduce((obj, childs)=> ( { name: childs, id: childs, type: '1', children: [obj] }), {})]
  }
  targetNodes = []
  targetEdges = []
  container = '';

  componentDidMount () {
    this.createTopo(this.targetNodes, this.targetEdges)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.targetNodes.length != this.props.targetNodes.length){
      this.targetNodes = (this.getNodesAndLinks(nextProps.targetNodes, [])).nodes.map(node => ({ ...node, url: (NODE_TYPES.find(item => item.type == node.detail_type) || NODE_TYPES[0]).pic_url }))
      this.targetEdges = (this.getNodesAndLinks(nextProps.targetNodes, [])).edges
      this.createTopo(this.targetNodes, this.targetEdges)
    }
  }

  createTopo (nodes, edges) {
    var width = +document.querySelector('#topo_svg').getBoundingClientRect().width,
        height = +document.querySelector('#topo_svg').getBoundingClientRect().height;
    var simulation = this.simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(200).strength(1))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));
    simulation.nodes(nodes).on('tick', ()=>this._update())
    simulation.force("link").edges(edges)
  }

  _update = throttle(()=>{this.setState({});}, 30)

  dragstarted = (d) =>{
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  dragged = (d) => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  dragended = (d) => {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  getNodesAndLinks (nodeTree, parent = {}, nodes = [], edges = []) {
    if (!nodeTree.length) {
      return { nodes, edges } ;
    }
    nodeTree.forEach((node) => {
      nodes.push(node);
      if (parent.target_id) {
        edges.push({ source: parent.target_id, target: node.target_id })
      }
      if (node.children && Array.isArray(node.children)) {
        nodes.concat(this.getNodesAndLinks(node.children, node, nodes, edges));
      }
    });
    return { nodes, edges };
  }
  render () {
    return (
      <div id="topo_content" ref={c => this.container = c}>
        <svg width="100%" height="100%" id="topo_svg">
          <g className="edges">
            {this.targetEdges.map((link, key) =>
              <line {...lineStyle(link)} key={key}/>
            )}
          </g>
          <g className="nodes">
            {this.targetNodes.map((node, key) =>
              <ContextMenu key={key} refs={() => this.container} dispatch={this.props.dispatch} actions={this.props.actions}>
                <g key={key} {...nodeStyle(node)} ref={e=>{
                    d3.select(e).call(d3.drag().on("start", this.dragstarted.bind(null, node))
                    .on("drag", this.dragged.bind(null, node))
                    .on("end", this.dragended.bind(null, node)))
                    // .on('contextmenu', function () {
                    //   alert.info('1111')
                    //   d3.event.preventDefault();
                    //   d3.event.stopPropagation();
                    // })
                  }}
                >
                  <image {...imageStyle} href={node.url}/>
                  <text {...textStyle}>{node.name}-{node.detail_type}-{node.type}</text>
                </g>
              </ContextMenu>
            )}
          </g>
        </svg>
      </div>
    )
  }
}).connect((state) => {
  let targetNodes = state.topo.targetNodes
  let targetEdges = state.topo.targetEdges
  return {
    targetNodes,
    targetEdges
  }
})
