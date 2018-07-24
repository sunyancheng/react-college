import React from 'react'
import { Slider, Icon } from 'antd'
import './style.less'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
export default class extends React.Component {
  scale = 1
  componentDidMount() {
    const { url: pdfPath} = this.props
    // 异步加载 PDF 相关的 js 文件
    import(/* webpackChunkName: "pdfjs-dist/webpack" */ 'pdfjs-dist/webpack').then(pdfjslib => {
      var loadingTask = pdfjslib.getDocument(pdfPath)
      loadingTask.promise.then((pdfDocument) => {
        this.pdfDocument = pdfDocument;
        this.prepareCanvas(1)
      }).catch(function (reason) {
        console.error('Error: ' + reason)
      })
    })
  }

  // 这里先创建pdf 页数多的 canvas 元素，并设置宽高，让滚动条固定
  // 如果缩放发送改变，重新调用这里
  prepareCanvas() {
    var scale = this.scale
    return this.pdfDocument.getPage(1).then((pdfPage) => {
      // Display page on the existing canvas with 100% scale.
      var viewport = pdfPage.getViewport(scale)
      this.viewportHeight = viewport.height

      // 缓存 canvas html element， 当 scale 改变了只需要改变已经存在元素的宽高即可
      let canvasMap = this.canvasMap || {};

      // 缓存已经渲染的页面，这里应为缩放变化需要清空
      this.renderedPage = {};
      for (var i = 1; i <= this.pdfDocument.numPages; i++) {
        let canv = canvasMap[i] || document.createElement('canvas');
        canv.id = 'canvas' + i;
        canv.width = viewport.width
        canv.height = viewport.height
        this.refs.container.appendChild(canv);
        canvasMap[i] = canv;
      }
      this.canvasMap = canvasMap
      return this.renderVisiblePages(0)
    })
  }
  // 根据滚动情况渲染页面，当然已经渲染过得页面不会多次渲染
  renderVisiblePages(top = 0) {
    var scale = this.scale;
    var start = Math.floor((top - 700) / this.viewportHeight)
    var end = Math.ceil((top + 700) / this.viewportHeight)
    if (start < 1) start = 1;
    if (end > this.pdfDocument.numPages) end = this.pdfDocument.numPages;
    return new Promise((resolve) => {
      this.renderedPage = this.renderedPage || {}
      const renderStartEnd = (i) => {
        if (i > end) return resolve();
        if (this.renderedPage[i]) return renderStartEnd(i + 1);

        this.pdfDocument.getPage(i).then((pdfPage) => {
          let canvas = this.canvasMap[i]
          var viewport = pdfPage.getViewport(scale)
          canvas.width = viewport.width
          canvas.height = viewport.height
          var ctx = canvas.getContext('2d')
          pdfPage.render({
            canvasContext: ctx,
            viewport: viewport
          }).then(() => {
            this.renderedPage[i] = true;
            renderStartEnd(i + 1)
          })
        })
      }
      renderStartEnd(start)
    })
  }

  setScale = debounce((v) => {
    try {
      this.scale = .5 + v * .02
    } catch (_) {
      this.scale = 1
    }
    this.renderingTask = (this.renderingTask || Promise.resolve()).then(() => this.prepareCanvas());
  }, 25)

  onScroll = throttle(() => {
    var top = this.refs.container.scrollTop
    this.renderingTask = (this.renderingTask || Promise.resolve()).then(() => this.renderVisiblePages(top));
  }, 25)

  render() {
    return (
      <div className="pdf-container">
        <div className="pdf-toolbar">
          <Icon type="setting" />
          <div>
            <span>缩放：50%</span>
            <Slider onChange={this.setScale} included={false} defaultValue={50} tipFormatter={v => `${50 + v * 2}%`} />
            <span>250%</span>
          </div>
        </div>
        <div key={this.props.url} onScroll={this.onScroll} className="pdf-container-wrapper" ref="container" />
      </div>
    )
  }
}
