import React from 'react'
import PropTypes from 'prop-types'
// import classNames from 'classnames'
import './style.less'

const InputLayout = (props) => {
  const { label, children, className } = props
  return (
    <div className={`input-layout ${className ? className : ''}`}>
      <label className="input-layout__label">{label}</label>
      {children}
    </div>
  )
}

export default InputLayout


InputLayout.protoTypes = {
  children: PropTypes.element.isRequired,
  label: PropTypes.any.isRequired
}
