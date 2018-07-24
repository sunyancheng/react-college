import React from 'react'
import Base from 'common/base'
import moment from 'moment'

export default class extends Base {
  render () {
    return <div>{ moment('2018-04-28 05:00:00').diff(moment(), 'hours') }</div>
  }
}