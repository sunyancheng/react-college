import React from 'react';
import Base from 'common/base';
import * as d3 from 'd3';
import './d3.less';
import { LINKS, NODES } from './targets-config';
export default (class extends Base {
  static defaultProps = {
    targets: [],
    targetNodes: [],
    nodes: [
      {
        name: 'node1', id: '1', type: '1', children: [
          {name: 'node11', id: '2', type: '2', children: [
            {name: 'node11', id: '3', type: '3'},
          ]},
        ]
      },
    ]
    // edges: [
    //   {'strokeWidth': 2},
    // ],
    // nodes: [
    //   {
    //     node: {
    //       // transform: function (d) { return `translate(${d.x}, ${d.y})` }
    //     },
    //     image: {
    //       'width': 54,
    //       'height': 48,
    //       'href': 'https://p1.ssl.qhimg.com/t01a49b21a2a959ef70.png'
    //     },
    //     text: {
    //       x: 58,
    //       y: 26,
    //       title: '哈哈哈'
    //     }
    //   }
    // ]
  }

  componentDidMount = () => {
    this.createTopo()
  }

  createTopo (/*props=this.props*/) {
    var svg = d3.select("svg"),
      width = +document.querySelector('#topo_svg').getBoundingClientRect().width,
      height = +document.querySelector('#topo_svg').getBoundingClientRect().height;
    var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(200).strength(1.5))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));
    var link = svg.append("g")
        .attr("class", "edges")
        .selectAll("line")
        .data(LINKS)
        .enter().append("line")
        .attr("stroke-width", 2);
    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(NODES)
        .enter()
        .append("g")
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
        );
    node.append('image')// 设置节点半径
        .attr("width", 54)
        .attr("height", 48)
        .attr('xlink:href', function (n) {return n.url})
    node.append("text")
        .text(function(d) { return d.id; })
        .attr('y', function () { return 58 })
        .attr('x', function () { return 26 })
    simulation
        .nodes(NODES)
        .on("tick", ticked);// 此处在每次tick时绘制力导向图
    simulation.force("link")
        .edges(LINKS);
    function ticked() {
      link
        .attr("x1", function(d) { return d.source.x + 26; })
        .attr("y1", function(d) { return d.source.y + 24; })
        .attr("x2", function(d) { return d.target.x + 26; })
        .attr("y2", function(d) { return d.target.y + 24; });
      // link.attr("d", function(d) {
      //   var dx = d.target.x - d.source.x,
      //       dy = d.target.y - d.source.y,
      //       dr = Math.sqrt(dx * dx + dy * dy);
      //   return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
      // });
      node.attr("transform", function (d) { return `translate(${d.x}, ${d.y})` })
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  getNodesAndLinks (nodeTree, parent = {}, nodes = [], edges = []) {
    if (!nodeTree.length) {
      return { nodes, edges } ;
    }
    nodeTree.forEach((node) => {
      nodes.push(node);
      if (parent.id) {
        edges.push({ source: parent.id, target: node.id })
      }
      if (node.children && Array.isArray(node.children)) {
        nodes.concat(this.getNodesAndLinks(node.children, node, nodes, edges));
      }
    });
    return { nodes, edges };
  }

  render () {
    return (
      <div id="topo_content">
        <svg width="100%" height="100%" id="topo_svg"/>
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
