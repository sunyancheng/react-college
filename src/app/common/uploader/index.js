import React from 'react'
import PropTypes from 'prop-types'
import './style.less'
import { Upload } from 'antd'
import { Button } from 'common/button'
import Alert from 'common/alert'
import { baseURL } from 'common/request/config'
import { Spin } from 'antd'
const INSERT_ONLT = 1

export default (class Uploader extends React.Component {
  static propTypes = {
    extra: PropTypes.object,
    disabled: PropTypes.bool,
    onLoading: PropTypes.func,
    isValid: PropTypes.func,
    type: PropTypes.string.isRequired,
    accept: PropTypes.string,
    showUploadList: PropTypes.bool,
    loading: PropTypes.bool,
    fileType: PropTypes.number
  }

  static defaultProps = {
    disabled: false,
    loading: undefined,
    fileType: 1
  }

  state = {
    isValidQueued: true
  }

  componentDidMount() {
    import(/* webpackChunkName: "s3weuploader" */ '!common/s3weuploader').then(S3WebUploader => {
      this.uploader = S3WebUploader.create({
        // auto: true,
        sendAsBinary: true,
        formData: {},
        compress: false,
        prepareNextFile: true,
        threads: 5,
        fileNumLimit: 10,
        fileSingleSizeLimit: 5000 * 1024 * 1024,
        insertOnly: INSERT_ONLT,//是否覆盖文件 1覆盖 0不覆盖
        getUploadurl: {
          url: `${baseURL}/core/resource/admin/resource/init-upload?type=${this.props.fileType}`,
          method: "POST"
        },
        autoCommit: true,
        bid: 'online_training',
        cid: 'vod_training_aq'
      })

      this.uploader.on('beforeFileQueued', () => {
        const { isValidQueued } = this.state
        if (!isValidQueued) this.props.onLoading(false)
        return isValidQueued
      })

      this.uploader.on('getupload-success', () => {
        this.uploader.upload()
        this.props.onLoading(true)
      })

      this.uploader.on('uploadSuccess', (file) => {
        const { name, size } = file
        this.props.onChange({
          name,
          size,
          fname: name,
          ...this.props.extra
        })
        Alert.info('上传成功')
        this.props.onLoading(false)
      })
      this.uploader.on('uploadError', () => {
        this.props.onLoading(false)
      })
    })
  }

  handleFiles = (file) => {
    const { size } = file
    const { type, fileType } = this.props
    new Promise((resolve) => {
      if (size > 1024 * 1024 * 500) {
        Alert.error('文件应小于500MB')
        return resolve(false)
      }
      if (size == 0) {
        Alert.error('不能上传空文件')
        return resolve(false)
      }
      if (type === "add") {
        this.props.isValid({ fname: file.name, type: fileType }).then(({ file_exists }) => {
          if (file_exists) {
            Alert.error('数据库中已存在同名文件')
            return resolve(false)
          }
          resolve(true)
        })
      } else if (type === 'edit') {
        this.props.isValid({ fname: file.name, type: fileType }).then(({ file_exists }) => {
          if (file_exists) {
            Alert.error('文件名已存在')
            return resolve(false)
          }
          resolve(true)
        })
      } else if (type === 'appendix') {
        this.props.isValid({ fname: file.name, type: fileType }).then(({ file_exists }) => {
          if (file_exists) {
            Alert.error('已存在同名附件')
            return resolve(false)
          }
          resolve(true)
        })
      } else {
        resolve(true)
      }
    }).then(isValidQueued => {
      this.setState({
        isValidQueued
      }, () => {
        this.uploader.addFiles(file)
        this.props.onLoading(isValidQueued)
      })
    })
    return false
  }

  render() {
    return (
      <Spin delay={300} spinning={this.props.loading || false}>
        <div className="uploader-wrapper">
          <Upload
            accept={this.props.accept}
            showUploadList={false}
            beforeUpload={this.handleFiles}
            disabled={this.props.disabled}
          >
            <Button disabled={this.props.disabled} size="small" ghost>选择文件</Button>
          </Upload>
          <div className="picker-detail">{this.props.value && this.props.value.fname}</div>
        </div>
      </Spin>
    )
  }
})
