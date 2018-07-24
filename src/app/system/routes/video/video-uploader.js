import React from 'react'
import PropTypes from 'prop-types'
import './web-uploader.css'
import Base from 'common/base'
import { Progress, Upload } from 'antd'
import VideoBrand from 'common/page/page-table-video'
import { Button, IconButton } from 'common/button'
import { Btn } from 'common/button-group'
import Alert from 'common/alert'
import './style.less'
import { baseURL } from 'common/request/config'
import S3WebUploader from '!common/s3weuploader'

const COVER = 0

window.URL = window.URL || window.webkitURL

export default (class Uploader extends Base {
  state = {
    filename: '',
    videos: [],
    hasUploadedVideos: [],
    fileJson: [],
    isValidQueued: false,
    videosObject: [],
  }

  static propTypes = {
    extra: PropTypes.object,
    onChange: PropTypes.func, // 由antd decorator注入
    isValid: PropTypes.func,
    actions: PropTypes.object
  }

  componentDidMount() {

    this.uploader = S3WebUploader.create({
      auto: true,
      sendAsBinary: true,
      formData: {},
      compress: false,
      prepareNextFile: true,
      threads: 10,
      fileNumLimit: 10,
      fileSingleSizeLimit: 5000 * 1024 * 1024,
      insertOnly: COVER,//是否覆盖文件 1覆盖 0不覆盖
      getUploadurl: {
        url: `${baseURL}/core/resource/admin/resource/init-upload?type=2&insertOnly=${COVER}`,
        method: "POST"
      },
      autoCommit: true,
      bid: 'online_training',
      cid: 'vod_training_aq'
    })

    this.uploader.on('beforeFileQueued', () => {
      const isValidQueued = this.state.isValidQueued
      if (!isValidQueued) this.props.onLoading(false) //不合法 取消loading
      return isValidQueued
    })

    this.uploader.on('getupload-success', (file) => {
      const videosObject = this.state.videosObject.slice()
      videosObject.push(file)
      this.setState({
        videosObject
      })
    })

    this.uploader.on('uploadSuccess', (file) => {
      this.props.uploadVideo([
        {
          name: file.name,
          fname: file.name,
          duration: this.props.videos.find(video => video.name === file.name).duration
        }
      ])
      // 删除已上传的videos并计入hasUploadedVideos中
      const hasUploadedVideos = this.state.hasUploadedVideos.slice()
      const currentVideo = this.props.videos.find(video => video.name === file.name)
      hasUploadedVideos.push(currentVideo)
      this.setState({
        hasUploadedVideos
      })
      let videos = this.props.videos.slice()
      this.setState(Object.assign({}, this.state.fileJson.push({
        name: file.name,
        fname: file.name,
        duration: videos.find(video => video.name === file.name).duration
      })))
      videos = videos.filter((video) => video.name !== file.name)
      this.dispatch(this.props.actions.updateVideoModal({ videos }))
    })

    this.uploader.on('uploadFinished', () => {
      this.props.onLoading(false)
      this.props.onChange(this.state.fileJson)
    })

    this.uploader.on('uploadProgress', (file, percentage) => {
      let videos = this.props.videos.slice()
      videos.find(video => video.name === file.name).percentage = /*Number*/parseFloat(percentage).toFixed(3)
      this.dispatch(this.props.actions.updateVideoModal({ videos }))
    })

    this.uploader.on('uploadError', () => {
      this.setState({ filename: '' })
      this.props.onLoading(false)
    })
    this.uploader.on('error', (type) => {
      Alert.error(type)
      this.props.onLoading(false)
    })

  }

  componentWillUnmount() {
    this.cancelAllUpload()
  }

  handleUpload = async (file) => {
    const { size } = file
    const videos = this.props.videos.slice()
    const json_fnames = videos.map(video => video.name)
    // editVideo标识是否是修改单视频文件
    let isValidQueued
    let errMsg
    let names
    if (size == 0) {
      isValidQueued = false
      errMsg = '不能上传空文件'
    }
    if (!this.props.editVideo) {
      const ret = await this.props.isValid({ json_fnames: JSON.stringify(json_fnames) })
      isValidQueued = ret.valid
      names = ret.names
      errMsg = `视频已存在${names ? '： ' + names.join(',') : '名字需要相同'}`
    } else {
      const { file_exists } = await this.props.isValid({ fname: videos[0].name })  // 每次只能上传一个视频文件
      isValidQueued = !file_exists
      errMsg = `该视频名称已存在`
    }
    if (!isValidQueued) Alert.error(errMsg)
    this.setState({
      isValidQueued
    }, () => {
      videos.forEach((video) => video.uploading = isValidQueued)   //根据合法性决定是否加uploading标识
      this.props.onLoading(true)
      this.uploader.addFiles(videos)
    })
  }

  handleFiles = (file, files) => {
    for (let i = 0; i < files.length; i++) {
      var isEmpty = files.some(f => {
        if (f.size == 0) {
          Alert.error(`不能上传大小为0KB的视频文件`)
          return true
        }
        return false
      })
      var isRepeat = this.props.videos.some(video => {
        var repeat = video.name === files[i].name
        if (repeat) Alert.error(`视频重名： ${video.name}`)
        return repeat
      })
    }
    if (isRepeat || isEmpty) return false
    this.setFileInfo(files)
    return false
  }
  /**
   * 计算入队的每一个video的duration
   */
  setFileInfo = (targets) => {
    const videos = this.props.videos.slice()
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]
      target.duration = 1234
      videos.push(target)
      if (i === targets.length - 1) {
        this.dispatch(this.props.actions.updateVideoModal({ videos }))
      }
    }
  }

  cancelUpload = (file) => {
    const obj = this.state.videosObject.find(obj => obj.name === file.name)
    if (obj) this.uploader.cancelFile(obj.id)
  }
  // 上传过程中 新加入videos队列的视频 isUploaded为true,uploading为false
  // 上传中的队列file对象中有isUploaded标志
  // 已完成上传队列 isUpload为truex
  deleteVideo = (target, isUploaded) => {
    if (!isUploaded && target.uploading) {
      this.cancelUpload(target)
    }
    const videos = this.props.videos.filter(video => video.name !== target.name)
    // http://fex.baidu.com/webuploader/doc/index.html#WebUploader_Uploader_stop
    this.dispatch(this.props.actions.updateVideoModal({ videos }))
  }

  cancelAllUpload = () => {
    this.props.videos.forEach(this.cancelUpload)
  }

  calcDuration = (duration) => {
    const minutes = Math.round(duration / 60)
    const seconds = duration % 60
    return ` ${minutes < 10 ? `0${minutes}` : `${minutes}`}:${`${seconds < 10 ? `0${seconds}` : `${seconds}`}`} `
  }

  calcVideoSize = (size) => {
    size = Number(size)
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`
    } else if (1024 * 1024 <= size && size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`
    } else if (size >= 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
    }
  }

  renderProgress = (percentage) => {
    const progress = percentage ? +(/*Number*/parseFloat(percentage) * 100).toFixed(2) : 0
    if (progress == 0)
      return <span style={{ fontSize: '12px', color: '#697B98' }}>等待上传</span>

    if (progress != 100)
      return (
        <Progress
          percent={progress} size="small"
          format={(percent) => percent + '%'}
        />
      )
    return <span style={{ fontSize: '12px', color: '#03AE64' }}>上传完成</span>
  }

  renderBodyRow = (video, isUploaded = false) => {
    return (
      <tr className="video-uploader__row video-uploader__row-body" key={video.name}>
        <td className="video-uploader__column" width="37.5%"><VideoBrand icon={`video1`}><div className="overflow">{video.name}</div></VideoBrand></td>
        <td className="video-uploader__column" width="12.5%">{this.calcVideoSize(video.size)}</td>
        <td className="video-uploader__column" width="37.5%"><div style={{ width: '90%' }}>{this.renderProgress(video.percentage)}</div></td>
        <td className="video-uploader__column" width="12.5%">{!isUploaded ? (<Btn type="danger" onClick={() => { this.deleteVideo(video, isUploaded) }}>删除</Btn>) : <div>&nbsp;&nbsp;&nbsp;</div>}</td>
      </tr>
    )
  }

  render() {
    if (typeof this.props.videos === 'undefined') return null
    return (
      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%' }}>
          <thead style={{ width: '100%', borderBottom: '1px solid #e5e5e5', backgroundColor: '#FFF' }}>
            <tr className="video-uploader__row video-uploader-th">
              <th className="video-uploader__column" width="37.5%">视频名称</th>
              <th className="video-uploader__column" width="12.5%">大小</th>
              <th className="video-uploader__column" width="37.5%">上传进度</th>
              <th className="video-uploader__column" width="12.5%">操作</th>
            </tr>
          </thead>
          <tbody className="video-uploader-tbody">
            {
              this.state.hasUploadedVideos && this.state.hasUploadedVideos.map(video => this.renderBodyRow(video, true))
            }
            {
              this.props.videos && this.props.videos.map(video => this.renderBodyRow(video, false))
            }
          </tbody>
        </table>
        <div className="video-uploader-actions">
          <Upload
            action=""
            accept="video/mp4"
            multiple={this.props.editVideo ? false : true}
            showUploadList={false}
            beforeUpload={this.handleFiles}
          >
            <IconButton style={{ color: 'rgb(51, 52, 68)' }} icon="add" size="small" ghost>选择文件</IconButton>
          </Upload>
          <Button disabled={this.props.modalLoading || this.props.videos.length === 0} size="small" onClick={this.handleUpload}>开始上传</Button>
        </div>
      </div>
    )
  }
}).connect((state) => {
  const { videos } = state.page.modalParams || {}
  const { modalLoading } = state.page
  return {
    videos,
    modalLoading
  }
})
