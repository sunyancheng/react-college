import React from 'react';
import './style.less';
// import ExpandBlockMask from 'common/expand-block-mask'

export const Layout = ({ children, className, ...rest }) => {
  return (
    <div className={`layout ${className || ''}`} {...rest}>
      {children}
      {/* <ExpandBlockMask /> */}
    </div>
  )
}

export const Main = ({ children, className, ...rest }) => <div className={`layout__main ${className || ''}`} {...rest}>{children}</div>
Main.Sider = ({ children, className, ...rest }) => <div className={`layout__main__sider ${className || ''}`} {...rest}>{children}</div>
Main.Content = ({ children, className, ...rest }) => <div className={`layout__main__content ${className || ''}`} {...rest}>{children}</div>
