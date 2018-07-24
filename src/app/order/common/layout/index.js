import React from 'react'
import './style.less'
export const Layout = ({children}) => <div className="layout">{children}</div>
export const LayoutFixed = ({children}) => <div className="layout-fixed-width">{children}</div>
Layout.Main = ({children}) => <div className="layout-main">{children}</div>
Layout.ContentWrap = ({children, className=""}) => <div className={`layout-content-wrapper ${className}`}>{children}</div>
Layout.Content = ({children}) => <div className="layout-content">{children}</div>