import React from 'react'
import { Upload, Button, Icon } from 'antd'
import { baseURL } from 'common/request/config'
import Alert from 'common/alert'
import './style.less'

export default class ScvUploader extends React.Component {
  uploadProps = {
    name: 'file',
    action: `${baseURL}/core/home/admin/pic/upload-pic`,
    withCredentials: true,
    showUploadList: false,
    accept: ".csv",
    onChange: ({ file }) => {
      this.setState({
        name: file.name
      })
      if (file.status === 'done') {
        Alert.success('文件上传成功');
      } else if (file.status === 'error') {
        Alert.error('文件上传失败');
      }
    }
  }
  state = {
    name: ''
  }

  download = () => {
    console.log('download')
  }

  render() {
    const { name } = this.state
    return (
      <div className="scv-uploader">
        <div className="scv-uploader__upload">
          {
            <div className="scv-uploader__upload-detail">{name || '请选择需要上传的试题文件'}</div>
          }
          <Upload {...this.uploadProps}>
            <Button><Icon type="upload" />浏览</Button>
          </Upload>
        </div>
        <div className="scv-uploader__desc">
          <span>提示：批量上传试题</span>
          <span onClick={this.download} className="scv-uploader__desc-download">模板下载</span>
        </div>
      </div>
    )
  }
}
