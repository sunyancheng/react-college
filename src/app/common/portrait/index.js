import React from 'react';
import { baseURL } from 'common/request/config';
import Icon from 'common/icon';
import { Upload } from 'antd';
import Alert from 'common/alert';
import './style.less';
import classNames from 'classnames'

const avatarProps = ({ onChange, action = `${baseURL}/core/home/admin/pic/upload-pic`, text, accept }) => ({
  name: 'pic1',
  action,
  headers: {
  },
  withCredentials: true,
  accept,
  showUploadList: false,
  onChange({ file }) {
    if (file.status === 'done') {
      if (!!file.response.errmsg) {
        Alert.error(`${text}上传失败`);
        return
      }
      Alert.success(`${text}上传成功`);
      onChange(file.response.data.join())
    } else if (file.status === 'error') {
      Alert.error(`${text}上传失败`);
    }
  },
});

export default class extends React.Component {
  render() {
    let { value, onChange, action, help, style, className, readonly, text = "图片", accept = "image/*", description = "2MB以内，jpg、png、gif方形图片" } = this.props;
    return (
      <figure className={classNames("avatar-component", className)} style={style}>
        <div className={`container ${value ? 'container--no-border' : ''}`} style={{ backgroundImage: 'url("' + value + '")' }}>
          {!readonly &&
            <Upload {...avatarProps({ onChange, action, text, accept })}>
              <div className="edit-wrapper"><Icon type="camera" /></div>
            </Upload>
          }
        </div>
        {!readonly && help && <figcaption className="description">{description}</figcaption>}
      </figure>
    );
  }
}
