import React from 'react'
import './style.less'

export const PageLayout = ({ className = '', children, ...rest }) => (<div className={`page-layout ${className}`} {...rest}>{children}</div>)
export const PageContent = ({ className = '', children, ...rest }) => (<div className={`page-layout__content ${className}`} {...rest}>{children}</div>)
PageContent.Cabinet = ({ className = '', children, ...rest }) => (<div className={`page-layout__content__cabinet ${className}`} {...rest}>{children}</div>)
PageContent.Rest = ({ className = '', children, ...rest }) => (<div className={`page-layout__content__rest ${className}`} {...rest}>{children}</div>)

export const PageHeader = ({ title, btn }) => (
  <header className="page-layout__header">
    <div className="page-layout__header-title">{title}</div>
    <div className="page-layout__header-btn">{btn}</div>
  </header>)


export const PageAside = ({ children }) => (
  <div className="page-layout__aside">
    {children}
  </div>
)
