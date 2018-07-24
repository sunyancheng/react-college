import React from 'react'
import Tooltip from 'common/tooltip'
import './style.less'

export default ({ name, avatar }) => {
  return <div><img className="avatar" src={avatar} /><Tooltip className="name" title={name} /></div>
}
