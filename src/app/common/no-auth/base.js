import React from 'react'
import Base from 'common/base'
import PropTypes from 'prop-types'
import './style.less'
import { Button } from 'common/button'

export default (class extends Base {

  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    redirect: PropTypes.string,
    redirectDesc: PropTypes.string.isRequired
  }

  static defaultProps = {
    redirectDesc: '原路返回'
  }

  onClick = () => {
    if (this.props.redirect)
      return this.props.history.replace(this.props.redirect)
    this.props.history.goBack()

  }

  render() {
    const { name, title, desc, redirectDesc } = this.props
    return (
      <div className="no-match">
        <div className={`no-match__bg-img no-match__bg-img-${name}`} />
        <div className="no-match__desc">
          <div className="no-match__desc-title">{title}</div>
          <div className="no-match__desc-detail">{desc}</div>
        </div>
        <div className="no-match__desc-button"><Button onClick={this.onClick}>{redirectDesc}</Button></div>
      </div>
    )
  }
}).withRouter()
