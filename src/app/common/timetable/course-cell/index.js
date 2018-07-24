import React from 'react'
import PropTypes from 'prop-types'
import './style.less'


export default class CourseCell extends React.Component {

  static defaultProps = {
    color: {
      background: '#E2F5E0',
      font: '#03AE64'
    }
  }

  render() {
    let { name, teacher, classroom } = this.props
    return (
      <div
        style={this.props.color}
        className={`course-cell ${this.props.merged ? ' merged' : ''}`}
        onClick={() => this.props.onClick()}
      >
        <div className="course-cell-header course-cell-detail">
          {name}
        </div>
        <div className="course-cell-desc course-cell-detail">
          {teacher}
        </div>
        <div className="course-cell-desc course-cell-detail">
          {classroom}
        </div>
      </div>
    )
  }
}

CourseCell.propTypes = {
  color: PropTypes.object
}
