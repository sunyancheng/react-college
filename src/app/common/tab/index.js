import React from 'react'
import './style.less'

const SuperTag = (props) => {
  const onClick = (type, id) => () => {
    props.onClick(type, id)
  }
  const id = props.id
  return (
    <span>
      <span className="list-operation list-operation-check" onClick={onClick('check', id)}>查看</span>|
      <span
        className={`list-operation ${props.avaliable?'list-operation-freeze':'list-operation-unfreeze' }`}
        onClick={onClick('freeze', id)}
      >
        {props.avaliable?'冻结':'解冻'}
      </span>
    </span>
  )
}


const NormalTag = (props) => {
  const onClick = (type, id) => () => {
    props.onClick(type, id)
  }
  const id = props.id
  return (
    <span>
      <span className="list-operation list-operation-check" onClick={onClick('update', id)}>更新</span>|
      <span className="list-operation list-operation-check" onClick={onClick('check', id)}>审核</span>|
      <span className="list-operation list-operation-delete" onClick={onClick('delete', id)}>删除</span>
    </span>
  )
}

const StatusBoard = ({data}) => {
  const { status } = data
  return (
    <div className={`status-board ${status === '1' ? 'status-board-normal' : 'status-board-alert'}`}>
      <span>{ status === '1' ? '正常' : '已冻结' }</span>
    </div>
  )
}



export default {
  SuperTag,
  NormalTag,
  StatusBoard
}
