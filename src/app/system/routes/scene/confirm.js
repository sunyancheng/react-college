import React from 'react'
import Base from 'common/base'
import './style.less'
import { SCENE_STATUS } from 'common/config'

export default (class extends Base {
  render() {
    const { experiment_id, user_id, create_status, time } = this.props
    return (
      <div>
        <div className="title">确定结束实验进程？</div>
        <div className="content">
          <div> 实验ID：{experiment_id}，实验人ID：{user_id}；</div>
          <div>实验状态：{SCENE_STATUS.find(v => v.value === create_status).label}，实验时长：{time}分钟</div>
        </div>
      </div>
    )
  }
}).connect((state) => {
  const { modalParams } = state.page
  const { experiment_id, user_id, create_status, time } = modalParams || {}
  return {
    experiment_id,
    user_id,
    create_status,
    time
  }
})
