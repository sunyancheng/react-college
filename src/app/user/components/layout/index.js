import React from 'react'
import classnames from 'classnames'
import './style.less'

// export this for header usage
export const LayoutFixedWidth = props => {
  return (
    <div className="layout-fixed-width">
      {props.children}
    </div>
  )
}

export default class Layout extends React.Component {
  render() {
    return (
      <section className={classnames('user-layout', {
          'user-layout-scrollable': this.props.scrollable,
          'user-layout-padding': this.props.padding
        })}
      >
        <LayoutFixedWidth>
          {this.props.children}
        </LayoutFixedWidth>
      </section>
    )
  }
}
