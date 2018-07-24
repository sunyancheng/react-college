import React from 'react'
import Modal from 'common/modal'
import Base from 'common/base'
import PropTypes from 'prop-types'
import './style.less'

export default (class extends Base {
  static propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  }
  state = {
    memo: '',
    user_id: ''
  }

  componentDidMount() {
    this.doInit();
  }

  componentWillReceiveProps(nextProps) {
    if (this.isVisible() !== this.isVisible(nextProps)) {
      this.doInit(nextProps);
    }
  }

  doInit(props = this.props) {
    if (!this.isVisible(props)) return;
    const initState = { init: true };
    if (props.initState) {
      return props.initState(props).
        then(state => this.setState(Object.assign(initState, state)));
    }
    this.setState(initState);
  }

  handleOk = () => {
    this.props.onSave()
  }

  isVisible = (props = this.props) => props.modalVisible[props.name]

  render() {
    // 没有初始化好就返回
    if (!this.state.init || !this.isVisible()) return null;
    const { config=[], modalParams } = this.props
    // const { model } = this.state
    return (
      <Modal
        width={620}
        title={this.props.title}
        visible
        onOk={this.handleOk}
        onCancel={this.props.onCancel}
      >
        <div className="user-info__content">
          {modalParams.pic && <img style={{backgroundImage: 'url("' + modalParams.pic +'")'}} className="user-info__content-avatar" />}
          <div>
            {
              config.map((item, index) => (
                <div key={index}><label>{item.name}：</label><span>{item.render ? item.render(modalParams[item.value]) : modalParams[item.value]}</span></div>
              ))
            }
          </div>
        </div>
      </Modal>
    )
  }
}).formConnect(
  state => {
    const { modalParams, modalVisible } = state.page
    return { modalParams, modalVisible }
  }
)
