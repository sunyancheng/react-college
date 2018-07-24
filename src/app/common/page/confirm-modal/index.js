import React from 'react'
import Base from 'common/base'
import Modal from 'common/modal'
import { Icon } from 'antd'
import './style.less'

export default (class extends Base {

  static defaultProps = {
    saveWithCancel: true
  }

  handleOk = () => {
    this.props.onSave(this.props.model);
    if (this.props.saveWithCancel) {
      this.props.onCancel();
    }
  }

  render() {
    const { modalVisible, name, message, ...rest } = this.props

    const visible = modalVisible[name];
    if (!visible) return null;

    return (
      <Modal visible {...rest} className="modal-delete-component" width={450} onOk={this.handleOk}>
        <Icon className="modal-delete-component__delete-icon" style={{ marginRight: 12 }} type="exclamation-circle" />
        <div className="modal-delete-component__content">{message || '确定删除吗？删除后不可恢复！'}</div>
      </Modal>
    )
  }
}).connect(state => {
  return { modalVisible: state.page.modalVisible, model: state.page.modalParams }
})
