import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Form } from 'antd'

export default class Base extends React.Component {

  dispatch(...actions) {
    actions.forEach(action => {
      return this.props.dispatch.bind(this)(action)
    });
  }

  static connect(...args) {
    return connect(...args)(this)
  }
  static formConnect(...props) {
    return Form.create({})(this.connect(...props));
  }
  static withRouter() {
    return withRouter(this);
  }
}
