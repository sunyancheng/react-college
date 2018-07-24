import React from 'react'
import PropTypes from 'prop-types'

const themes = {
  normal: '#F0F0F0',
  blue: '#0FBF73'
}

export default class RingChart extends React.Component {
  static defaultProps = {
    type: 'normal', // 图类型 normal | ring
    theme: 'blue',
    strokeWidth: 10, // 圆环宽度
    size: 100,
    percent: 0.1
  }

  state = {
    cx: 0,
    cy: 0,
    radius: 0
  }

  componentWillMount() {
    const { size, strokeWidth } = this.props
    const cx = 0.5 * size // 圆心坐标
    const cy = 0.5 * size
    const radius = cx - strokeWidth  // 半径
    this.setState({
      cx,
      cy,
      radius
    })
  }

  renderCircle(type, cx, cy, radius, strokeWidth, theme, { gap, progress, perimeter }, isBackground) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        strokeWidth={strokeWidth}
        stroke={themes[theme]}
        fill="none"
        strokeDasharray={`${isBackground ? `${perimeter} ${gap}` : `${progress} ${gap}`}`}
        transform={`${isBackground ? '' : `rotate(${-90},${cx},${cy})`}`}
      />
    )
  }

  render() {
    const { cx, cy, radius } = this.state
    const { strokeWidth, percent, type, theme, size } = this.props
    const perimeter = 2 * Math.PI * radius // 周长
    const obj = {
      gap: perimeter + 1, // stroke间距
      progress: percent * perimeter,
      perimeter
    }
    return (
      <svg width={size} height={size} ref={ele => this.box = ele}>
        {this.renderCircle(type, cx, cy, radius, strokeWidth, 'normal', obj, true)}
        {
          this.props.type === 'ring' &&
          this.renderCircle(type, cx, cy, radius, strokeWidth, theme, obj, false)
        }
      </svg>
    )
  }
}

RingChart.propTypes = {
  type: PropTypes.oneOf(['normal', 'ring']),
  theme: PropTypes.string,
  strokeWidth: PropTypes.number,
  size: PropTypes.number,
  percent: PropTypes.number
}
