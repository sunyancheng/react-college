import React from 'react'
import PropTypes from 'prop-types'

const commonTranslate = '60,30'

export default class RadarChart extends React.PureComponent {
  static defaultProps = {
    radius: 100,
    data: []
  }

  calcDeg(deg) {
    return 2 * Math.PI / 360 * deg
  }

  getScores() {
    return this.props.data.map(i => i[1]/10)
  }

  calculatePoint(points) {
    const { radius } = this.props
    const cx = radius * Math.cos(this.calcDeg(30))
    const cy = radius
    const rules = this.renderFunc()
    const pointArr = []
    points.forEach((score, index) => {
      const { x, y } = rules[index](score, cx, cy)
      pointArr.push({ x, y })
    })
    return pointArr
  }

  renderFunc() {
    const deg30 = this.calcDeg(30)
    const radius = this.props.radius
    return [
      (score, x, y) => ({ x, y: y - score / 10 * radius }), // 从中心点向上加
      (score, x, y) => ({ x: x + Math.cos(deg30) * score / 10 * radius, y: y - Math.sin(deg30) * score / 10 * radius }),
      (score, x, y) => ({ x: x + Math.cos(deg30) * score / 10 * radius, y: y + Math.sin(deg30) * score / 10 * radius }),
      (score, x, y) => ({ x, y: y + score / 10 * radius }),
      (score, x, y) => ({ x: x - Math.cos(deg30) * score / 10 * radius, y: y + Math.sin(deg30) * score / 10 * radius }),
      (score, x, y) => ({ x: x - Math.cos(deg30) * score / 10 * radius, y: y - Math.sin(deg30) * score / 10 * radius })
    ]
  }

  renderSinglePoint(cx, cy, r, color = "#0FBF73") {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        strokeWidth={2}
        stroke={color}
        fill={color}
        transform={`translate(${commonTranslate})`}
        key={Math.random(1)}
      />
    )
  }

  renderPointGroup(points) {
    return points.map((point, index) => {
      return (
        <circle
          cx={point.x}
          cy={point.y}
          r={4}
          strokeWidth={1.5}
          stroke={'#fff'}
          fill="rgb(74,164,103)"
          transform={`translate(${commonTranslate})`}
          key={index}
        />
      )
    })
  }

  renderPolygn(points) {
    return (
      <polygon points={points.map(({ x, y }) => `${x},${y}`).join(' ')}
        transform={`translate(${commonTranslate})`}
        fill="rgba(123,210,175,0.6)"
      />
    )
  }

  renderPolygnBackground(points, index) {
    const temp = points.map(({ x, y }) => `${x},${y}`).join(' ')
    const textTranslate = [
      { pos: '40,24' },
      { pos: '65,35' },
      { pos: '65,35' },
      { pos: '40,45' },
      { pos: '15,35' },
      { pos: '15,35' },
    ]
    if (index === 0) {
      const text = points.map((pos, i) => {return (
        <text fill="#8494AD"
          style={{ fontSize: 10 }}
          key={i}
          transform={`translate(${textTranslate[i].pos})`} x={pos.x} y={pos.y}
        >{this.props.data[i][0]}</text>
      )})
      return [
        ...text,
        <polygon key={`polygon${index}`} points={temp}
          transform={`translate(${commonTranslate})`}
          fill={`${index % 2 !== 0 ? '#FFF' : 'rgba(202,202,202,0.5)'}`}
        />
      ]
    }
    return (
      <polygon key={index} points={temp}
        transform={`translate(${commonTranslate})`}
        fill={`${index % 2 !== 0 ? '#FFF' : 'rgba(202,202,202,0.5)'}`}
      />
    )
  }

  renderBackground() {
    const arr = []
    for (let i = 0; i < 10; i++) {
      arr[i] = new Array(6).fill(i + 1)
    }
    arr.reverse()
    const res = arr.map(layer => {
      return this.calculatePoint(layer)
    })
    const length = res.length
    return res.map((graph, index) => {
      return this.renderPolygnBackground(graph, index, length)
    })
  }

  render() {
    const { width, data } = this.props
    if(!data.length) return null
    const points = this.calculatePoint(this.getScores())
    return (
      <svg width={width} height={this.props.radius * 2 + 60}>
        {this.renderBackground()}
        {this.renderPolygn(points)}
        {this.renderPointGroup(points)}
      </svg>
    )
  }
}

RadarChart.propTypes = {
  radius: PropTypes.number,
  width: PropTypes.number
}
