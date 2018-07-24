import React from 'react'
import Base from 'common/base'
import './style.less'
import Table from 'admin/components/table'

const columns = [{
  title: '用户ID',
  dataIndex: 'id',
  key: 'id'
}, {
  title: '账号',
  dataIndex: 'account',
  key: 'account'
}, {
  title: '昵称',
  dataIndex: 'nickname',
  key: 'nickname'
}, {
  title: '身份',
  dataIndex: 'character',
  key: 'character'
}, {
  title: '注册时间',
  dataIndex: 'date',
  key: 'date'
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status'
}, {
  title: '操作',
  dataIndex: 'operation',
  key: 'operation'
}]

const data = [{
  key: '1',
  id: '1234567890',
  account: '常泽清',
  nickname: '工大吴彦祖',
  character: '大帅比',
  date: '2018/3/12',
  status: '工厂模式之神',
  operation: '呵呵'
}, {
  key: '2',
  id: '1234567890',
  account: '常泽清',
  nickname: '工大吴彦祖',
  character: '大帅比',
  date: '2018/3/12',
  status: '工厂模式之神',
  operation: '呵呵'
}, {
  key: '3',
  id: '1234567890',
  account: '常泽清',
  nickname: '工大吴彦祖',
  character: '大帅比',
  date: '2018/3/12',
  status: '工厂模式之神',
  operation: '呵呵'
}, {
  key: '4',
  id: '1234567890',
  account: '常泽清',
  nickname: '工大吴彦祖',
  character: '大帅比',
  date: '2018/3/12',
  status: '工厂模式之神',
  operation: '呵呵'
}, {
  key: '5',
  id: '1234567890',
  account: '常泽清',
  nickname: '工大吴彦祖',
  character: '大帅比',
  date: '2018/3/12',
  status: '工厂模式之神',
  operation: '呵呵'
}, {
  key: '6',
  id: '1234567890',
  account: '常泽清',
  nickname: '工大吴彦祖',
  character: '大帅比',
  date: '2018/3/12',
  status: '工厂模式之神',
  operation: '呵呵'
}, {
  key: '7',
  id: '1234567890',
  account: '常泽清',
  nickname: '工大吴彦祖',
  character: '大帅比',
  date: '2018/3/12',
  status: '工厂模式之神',
  operation: '呵呵'
}, {
  key: '8',
  id: '1234567890',
  account: '常泽清',
  nickname: '工大吴彦祖',
  character: '大帅比',
  date: '2018/3/12',
  status: '工厂模式之神',
  operation: '呵呵'
}, {
  key: '9',
  id: '1234567890',
  account: '常泽清',
  nickname: '工大吴彦祖',
  character: '大帅比',
  date: '2018/3/12',
  status: '工厂模式之神',
  operation: '呵呵'
}, {
  key: '10',
  id: '1234567890',
  account: '常泽清',
  nickname: '工大吴彦祖',
  character: '大帅比',
  date: '2018/3/12',
  status: '工厂模式之神',
  operation: '呵呵'
}, {
  key: '11',
  id: '1234567890',
  account: '常泽清',
  nickname: '工大吴彦祖',
  character: '大帅比',
  date: '2018/3/12',
  status: '工厂模式之神',
  operation: '呵呵'
}, {
  key: '12',
  id: '1234567890',
  account: '常泽清',
  nickname: '工大吴彦祖',
  character: '大帅比',
  date: '2018/3/12',
  status: '工厂模式之神',
  operation: '呵呵'
}]

const flexItemId = [2, 4, 6]

class List extends Base {
  render() {
    return (
      <div className="admin-list">
        <div className="admin-list-board">
          <div className="admin-list-board-input">{this.props.board}</div>
          <div className="admin-list-board-btn">{this.props.buttons}</div>
        </div>
        <div className="admin-list__table-wrapper">
          <Table columns={columns} dataSource={data} flexItemId={flexItemId} />
        </div>
        <div style={{height: '60px', backgroundColor: '#333'}}>分页</div>
      </div>
    )
  }
}

export default List
