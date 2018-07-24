import React from 'react'
import Icon from 'common/icon'
import { Upload } from 'antd'
import { baseURL } from 'common/request/config';
import { Modal } from 'antd';
export default class extends React.Component {
  state = {
    fileList: [],
    previewVisible: false,
    previewImage: '',
  }

  defaultAvatarProps = {
    action: `${baseURL}/core/home/admin/pic/upload-pic`,
    headers: {
    },
    withCredentials: true,
    accept: 'image/*',
  }

  static defaultProps = {
    max: 3
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  state = {
    fileList: (this.props.value || []).map((url, i) => ({
      uid: i,
      status: 'done',
      url: url,
      showPic: true
    }))
  }


  handleChange = ({ fileList }) => {
    this.setState({ fileList }, () => {
      const imgs = fileList.map(img => img.showPic ? img.url : !!img.response ? img.response.data[0] : "")
      this.props.onChange(imgs)
    })
  }

  render() {
    const { fileList, previewImage, previewVisible } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    return (
      <div>
        <Upload
          {...this.defaultAvatarProps}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= this.props.max ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
