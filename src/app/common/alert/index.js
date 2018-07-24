import React from 'react';
import Icon from 'common/icon';
import './style.less';

var messageArrived = () => {};
class Alert extends React.Component {
  componentDidMount() {
    messageArrived = ({ message, type, description }) => this.handleMessageArrived({ message, type, description });
  }

  state = { messages: [] }

  isScrolling = false

  handleMessageArrived(message) {
    var messages = this.state.messages;
    if (messages.length > 0 && messages[messages.length - 1].message === message.message) {
      if (messages.length === 1 && this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
        this.scrolling = false;
      }
    } else {
      messages.push(message);
    }
    this.forceUpdate();
    this.scrollMessages(true);
  }

  invokeCallback(message) {
    message = message[0];
    if (message.cb) {
      message.cb();
    }
  }
  scrollMessages(startScrolling) {
    if (this.scrolling && startScrolling) {
      return;
    }
    this.scrolling = true;

    this.timeoutId = setTimeout(() => {
      var index = null;
      for (var i = 0, l = this.state.messages.length; i < l; i++) {
        if (this.state.messages[i].type !== 'error') {
          index = i;
          break;
        }
      }
      if (index !== null) {
        var deleted = this.state.messages.splice(index, 1);
        this.invokeCallback(deleted);
        this.forceUpdate();
        this.scrollMessages(false);
      } else {
        this.scrolling = false;
      }
    }, 1000);
  }

  handleCloseAlert(index) {
    var messages = this.state.messages;
    var message = messages.splice(index, 1);
    this.invokeCallback(message);
    this.setState({ messages });
  }

  render () {
    return (
      <div className="alert-component__wrapper">
      {this.state.messages.map((message, i) => (
        <div key={i} className={`alert-component__item ${message.type == 'success' ? 'succeed' : 'error'}`}>
          <div className="alert-component__icon"><Icon type={message.type == 'success' ? 'succeed' : 'error'}/></div>
          <div className="alert-component__content">
            <div className={`alert-component__title ${message.type ? message.type : ' error '} ${!message.description && 'single' }`}>{message.message}</div>
            {message.description && <div className="alert-component__sub-title">{message.description}</div>}
          </div>
          {message.type !== 'success' && <div className="alert-component__close" onClick={() => this.handleCloseAlert(i)}><Icon type="close"/></div>}
        </div>)
      )}
      </div>
    );
  }
}

Alert.info = Alert.success = (message, description) => messageArrived({ message, type: 'success', description });
Alert.warning = (message, description) => messageArrived({ message, type: 'warning', description });
window.alert = Alert;
Alert.error = (message, description) => {
  if (message !== false) {
    messageArrived({ message, type: 'error', description });
  }
};
Alert.show = messageArrived;
export default Alert;