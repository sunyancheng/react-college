import React from 'react'
import Base from 'common/base'
import Modal from 'common/modal'
import classnames from 'classnames';
import { PageLayout, PageContent, PageHeader } from '../page-layout'
import { Button } from 'antd';
export default (class extends Base {

  render() {
    const { isPage, title, onOk, onCancel, extraBtn, className, modalLoading, children, buttons, okText, cancelText, extraText, ...rest } = this.props
    let footer = [
      <Button loading={!onOk && modalLoading} key="close" type={onOk ? '' : 'primary'} onClick={onCancel}>{cancelText || (onOk ? '取消' : '关闭')}</Button>
    ]
    if (extraBtn) {
      footer.unshift(<Button key="extra" loading={modalLoading} onClick={extraBtn}>{extraText || '额外'}</Button>)
    }
    if (onOk) {
      footer.unshift(<Button key="submit" loading={modalLoading} type="primary" onClick={onOk}>{okText || '确定'}</Button>)
    }
    if (!isPage) {
      return (
        <Modal
          title={title}
          visible onOk={onOk}
          onCancel={onCancel}
          className={classnames('training-modal__component', className)}
          {...rest}
          confirmLoading={modalLoading}
          footer={footer}
        >{children}</Modal>
      )
    }
    return (
      <PageLayout className={className}>
        <PageHeader title={title} btn={buttons} />
        <PageContent className="page-form">
          {children}
          <div className="page-form-bottom">
            {footer}
          </div>
        </PageContent>
      </PageLayout>
    )
  }
}).connect(state => ({ modalLoading: state.page.modalLoading }))
