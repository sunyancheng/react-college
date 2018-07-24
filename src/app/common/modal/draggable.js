import React from 'react';
export default class extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      const dom = this.header = document.querySelector('.ant-modal-header');
      if (!dom) {
        return;
      }
      dom.style.cursor = 'move';
      dom.addEventListener('mousedown', this.onMouseDown);
    });

  }
  componentWillUnmount() {
    if (this.header) {
      this.header.removeEventListener('mousedown', this.onMouseDown);
    }
  }
  isMove = false;
  initialMove = { x: 0, y: 0 };

  onMouseDown = e => {
    const dom = this.modalDom = document.querySelector('.ant-modal');
    this.isMove = true;
    this.initialMove = { x: e.pageX - (parseInt(dom.style.left) || 0), y: e.pageY - (parseInt(dom.style.top) || 0) };
    document.body.style.userSelect = "none";
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = e => {
    if (!this.isMove) { return; }
    let dom = this.modalDom
    if (e.pageY > 0 && e.pageY < window.screen.height) {
      dom.style.top = (e.pageY - this.initialMove.y) + 'px';
    }
    if (e.pageX > 0 && e.pageX < window.screen.width) {
      dom.style.left = (e.pageX - this.initialMove.x) + 'px';
    }
  }

  onMouseUp = () => {
    this.isMove = false;
    document.body.style.userSelect = "auto";
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }
  render() {
    return this.props.children;
  }
}
