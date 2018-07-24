import React from 'react'
import FileInput from 'common/file-input'
import './uploader.less'

export default class extends React.Component {
  render() {
    return (
      <div className="exam-uploader">
        <FileInput accept=".csv" {...this.props} />
        <div className="download"><span>提示：批量上传试题</span><a href="/test-template.csv">模板下载</a></div>
      </div>
    )
  }
}
