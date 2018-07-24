import React from 'react'
import PropTypes from 'prop-types'
var BraftEditor
import 'braft-editor/dist/braft.css'
import { baseURL } from 'common/request/config'
import debounce from 'lodash/debounce';

export default class extends React.Component {

  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any
  }
  state = {}
  componentDidMount() {
    import(/* webpackChunkName: "braft-editor" */ 'braft-editor').then((c) => {
      BraftEditor = (c.__esModule ? c.default : c)
      this.setState({ braftEditorLoaded: true })
    })
  }

  controls = [
    'undo', 'redo', 'split', 'link', 'font-size', 'font-family', 'line-height', 'letter-spacing',
    'indent', 'text-color', 'bold', 'italic', 'underline', 'strike-through', 'text-align', 'split', 'headings', 'list_ul',
    'list_ol', 'blockquote', 'code', 'split', 'media', 'clear'
  ]

  extendControls = [
    {
      type: 'button',
      text: 'Hello',
      html: '<span style="padding: 0 10px">点击预览</span>',
      hoverTitle: 'Hello World!',
      className: 'preview-button',
      onClick: () => {
        const { content } = this.state
        const newWindow = window.open("", "", "status,height=800,width=1200")
        newWindow.document.write(
          `<!DOCTYPE html><html style="margin:0;padding:0;height:100%;width: 100%" lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title></head>
          <body style="margin:0;padding:0;width:100%;height:100%;background-color: #f1f2f3;"><div style="min-height:100%;width:1200px;margin:0 auto;padding: 30px;background-color:#FFF">${content || ''}<div></body>
          `
        )
      }
    }
  ]

  onHTMLChange = debounce((content) => {
    this.setState({
      content
    })
    this.props.onChange(content)
  }, 25)

  uploadFn = (params) => {
    const serverURL = `${baseURL}/core/home/admin/pic/upload-pic`
    const xhr = new XMLHttpRequest
    xhr.withCredentials = true
    const formData = new FormData()

    const successFn = () => {
      const res = JSON.parse(xhr.responseText)
      params.success({
        url: res.data[0]
      })
    }
    const progressFn = (event) => {
      params.progress(event.loaded / event.total * 100)
    }
    const errorFn = () => {
      params.error({
        msg: 'unable to upload.'
      })
    }
    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)
    formData.append('file', params.file)
    xhr.open('POST', serverURL, true)
    xhr.send(formData)
  }

  render() {
    if (!this.state.braftEditorLoaded) { return null }
    const editorProps = {
      height: 700,
      contentFormat: 'html',
      initialContent: this.props.value ? this.props.value : '',
      onHTMLChange: (htmlContent) => this.onHTMLChange(htmlContent),
      controls: this.controls,
      extendControls: this.extendControls,
      media: {
        video: false,
        audio: false,
        uploadFn: this.uploadFn
      }
    }
    return <BraftEditor {...editorProps} />
  }
}
