import React from 'react';
import { TARGET_PIC } from 'common/config'
import Base from 'common/base';
import * as d3 from 'd3';
import './d3.less';
import throttle from 'lodash/throttle'
import { Menu, Dropdown } from 'antd';

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

class ContextMenu extends React.Component {
  menu = (
    <Menu onClick={({ key }) => this.handleClick(key)}>
      <Menu.Item key="edit">编辑节点</Menu.Item>
      <Menu.Item key="link">添加连线</Menu.Item>
      <Menu.Item key="delete">删除</Menu.Item>
    </Menu>
  );

  handleClick = (key) => {
    this.props[`on${key[0].toUpperCase()}${key.substr(1)}Target`](this.props.node);
  }

  render () {
    let { children, refs } = this.props;
    return (
      <Dropdown overlay={this.menu} getPopupContainer={() => refs()} placement="bottomLeft" trigger={['contextMenu']}>
        { children }
      </Dropdown>
    );
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
  svg = '';

  componentDidMount () {
    this.createTopo(this.targetNodes, this.targetEdges)
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(nextProps.targetNodes) !== JSON.stringify(this.props.targetNodes)){
      this.targetNodes = (this.getNodesAndLinks(nextProps.targetNodes, [])).nodes.map(node => ({ ...node, url: (TARGET_PIC.find(item => item.type == node.detail_type) || TARGET_PIC[0]).pic_url }))
      this.targetEdges = (this.getNodesAndLinks(nextProps.targetNodes, [])).edges
      this.createTopo(this.targetNodes, this.targetEdges)
    }
  }

  createTopo (nodes, edges) {
    var width = +document.querySelector('#topo_svg').getBoundingClientRect().width,
        height = +document.querySelector('#topo_svg').getBoundingClientRect().height;
        d3.select('.svg_container').attr('width', width).attr('height', height);
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
  line = ''
  mousedown = (_, e) => {
    console.log('down')
    var m = d3.mouse(e);
    this.isDrag = true;
    this.line = d3.select(e).append('line')
      .attr("x1", m[0])
      .attr("y1", m[1])
      .attr("x2", m[0])
      .attr("y2", m[1]);
  }
  mousemove = (_, e) => {
    if (!this.isDrag) return;
    var m = d3.mouse(e);
    this.line.attr("x2", m[0]).attr("y2", m[1]);
  }
  mouseup = (_, e) => {
    this.isDrag = false;
    console.log('up')
    d3.select(e).on('mousemove', () => {})
  }
  getNodesAndLinks (nodeTree, parent = {}, nodes = [],edges = []) {
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
        <svg width="100%" height="100%" id="topo_svg" ref={e=>{
          this.svg = e;
          d3.select(e).on("mousedown", this.mousedown.bind(null, e, e))
          .on("mousemove", this.mousemove.bind(null, e, e))
          .on("mouseup", this.mouseup.bind(null, e))
        }}
        >
          <g className="links">
            {this.targetLinks.map((link, key) =>
              <line {...lineStyle(link)} key={key}/>
            )}
          </g>
          <g className="nodes">
            {this.targetNodes.map((node, key) =>
              <ContextMenu key={key}
                node={node}
                refs={() => this.container}
                {...this.props}
              >
                <g key={key} {...nodeStyle(node)} ref={e=>{
                    d3.select(e).on("mousedown", this.mousedown.bind(null, node, this.svg))
                    .on("mousemove", this.mousemove.bind(null, node, this.svg))
                    .on("mouseup", this.mouseup.bind(null, this.svg)).call(d3.drag().on("start", this.dragstarted.bind(null, node))
                    .on("drag", this.dragged.bind(null, node))
                    .on("end", this.dragended.bind(null, node)))
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
