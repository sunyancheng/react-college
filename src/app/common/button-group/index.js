import React from 'react'
import './style.less'

export const BtnGroup = ({children}) => {
  return (
    <div className="button-group">
      {children}
    </div>
  )
}

export const Btn = ({children, className="", type="common", onClick, disabled, style={}}) => {
  const handleClick = () => {
    if(disabled) return
    onClick()
  }
  return (
    <span
      style={style}
      className={`button-item button-item-${type} ${disabled ? 'button-item-disabled' : ''} ${className}`}
      onClick={handleClick}
    >
      {children}
    </span>
  )
}

export const MsgBtn = ({children, className="", type="common", disabled, style={}}) => {
  return (
    <span
      style={style}
      className={`button-item button-item-${type} ${disabled ? 'button-item-disabled' : ''} ${className}`}
    >
      {children}
    </span>
  )
}

BtnGroup.Button = Btn
export default BtnGroup
