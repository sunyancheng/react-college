import React from 'react'
import Base from 'common/base'
import PropTypes from 'prop-types'
import Uploader from 'common/uploader'
import { Btn } from 'common/button-group'
import { Spin } from 'antd'
import api from 'common/api'

export default (class extends Base {
  static propTypes = {
    onChange: PropTypes.func,
    onLoading: PropTypes.func,
    value: PropTypes.any,
  }

  state = {
    value: this.props.value
  }

  handleDelete = () => {
    this.onChange({ fname: '' })
  }

  onChange = (value) => {
    this.setState({
      value
    })
    this.props.onChange(value)
  }

  render() {
    const { onLoading, modalLoading } = this.props
    const { value } = this.state
    const disabled = !!value.fname
    return (
      <Spin delay={300} spinning={modalLoading || false}>
        <div className="appendix-uploader">
          <Uploader
            type="appendix"
            accept=".zip,.rar,.tar,.7z,.tar.7z"
            onLoading={onLoading}
            disabled={disabled}
            onChange={this.onChange}
            value={value}
            isValid={({ fname, type }) => api.isFileExist({ fname, type })}
            fileType={4}
          />
          {disabled && <Btn onClick={this.handleDelete}>删除</Btn>}
        </div>
      </Spin>
    )
  }
}).connect(state => ({ modalLoading: state.page.modalLoading }))
