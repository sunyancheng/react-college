import React from 'react'
import LoadingIcon from 'common/loading-icon'
import './style.less'

export default props => {
  if (props.pastDelay) {
    return <div className="loading">
      <LoadingIcon />
    </div>
  } else {
    return null;
  }
}