import React from 'react'
import './style.less'
import Loading from 'common/loading'

export default ({ loading = true }) => {
  return (
    <div className="mobile-loading">
      <Loading pastDelay={loading} />
    </div>
  )
}
