import React from 'react'
import chimeePluginControlbar from 'chimee-plugin-controlbar'
import './video.less'

export default class extends React.Component {
  async componentDidMount() {
    const { event = {}, enableControlBar = {}, toolbar = false } = this.props
    const Chimee = await import(/* webpackChunkName: "chimee" */ 'chimee-player')
    const plugin = []
    if (toolbar) {
      Chimee.install(chimeePluginControlbar)
      plugin.push({
        name: chimeePluginControlbar.name,
        // majorColor: '#0FBF73',
        children: {
          play: {},
          progressTime: {
          },
          progressBar: {
            layout: 'top',
            create() {
              this.$dom.style.top = '-20px'
            }
          },
          volume: {},
          clarity: enableControlBar,
          playbackrate: {
            list: [
              { name: '0.5倍速', value: 0.5 },
              { name: '1倍速', value: 1, default: true },
              { name: '2倍速', value: 2 }
            ],
            create() {
              this.$dom.className = 'playbackrate-custom ' + this.$dom.className
              setTimeout(() => {
                const dom = window.document.getElementsByTagName('chimee-control-wrap')[0]
                dom.className = 'chimee-control-wrap'
              }, 0)
            },
            // 可以指定 event 来绑定一些事件，默认 this 是该插件，而不是 dom
            event: {
              click() {
                console.log('click')
              }
            }
          },
          screen: {},
        }
      })
    }
    this.chimee = new Chimee({
      wrapper: '#wrapper', src: this.props.url, controls: true,
      autoplay: false,
      events: {
        play() {
        },
      },
      plugin
    })
    event.loadstart && this.chimee.on('loadstart', event.loadstart)
    event.canplay && this.chimee.on('canplay', event.canplay)
    event.error && this.chimee.on('error', event.error)
    event.abort && this.chimee.on('abort', event.abort)
  }
  render() {
    return <div style={{ height: '100%' }} id="wrapper" />
  }
}
