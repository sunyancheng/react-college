import React from 'react'
import './style.less'
import { Tooltip } from 'antd'
import Flag from './flag'

export default ({ timetable }) => {
  const first = timetable.slice(0, 2)
  const second = timetable.slice(2, 4)
  const third = timetable.slice(4, 6)
  const forth = timetable.slice(6, timetable.length)

  const color = [
    {
      name: 'green',
      backgroundColor: '#E2F5E0',
      color: '#03AE64'
    }, {
      name: 'red',
      backgroundColor: '#FFE7EC',
      color: '#E72F4E'
    }, {
      name: 'blue',
      backgroundColor: '#E3F4FF',
      color: '#2696DE'
    }, {
      name: 'orange',
      backgroundColor: '#FFF0DB',
      color: '#F1541D'
    },
    // {
    //   name: 'gray',
    //   backgroundColor: '#EAEAEA',
    //   color: '#435269'
    // },
    {
      name: 'purple',
      backgroundColor: '#EEE7FF',
      color: '#9150DD'
    },
    {
      name: 'yellow2',
      backgroundColor: '#FFF99E',
      color: '#D57100'
    },
    {
      name: 'blue2',
      backgroundColor: '#C3F5F1',
      color: '#0CA397'
    },
    {
      name: 'green2',
      backgroundColor: '#D6FFC2',
      color: '#059347'
    },
  ].sort(() => Math.random() > 0.5)

  const dic = []
  const colors = {}
  timetable.forEach(v => {
    if (v && v.id && !dic.includes(v.id)) {
      dic.push(v.id)
    }
  })

  dic.forEach((v, i) => {
    colors[v] = color[i]
  })

  const isEqual = (pair) => {
    return pair[0].id === pair[1].id
  }

  const genStyle = (id) => {
    return id
    ? {
      backgroundColor: colors[id].backgroundColor,
      color: colors[id].color
    }
    : {}
  }

  const renderTimeTableCell = (cell) => {
    return <Tooltip title={<Flag info={cell} />}><span style={genStyle(cell.id)} className="user-board__timetable-cell">{cell.name ? cell.name : '/'}</span></Tooltip>
  }

  const renderTimeTableHalf = (cell) => {
    return <Tooltip title={<Flag info={cell} />}><span style={genStyle(cell.id)} className="user-board__timetable-halfcell">{cell.name ? cell.name : '/'}</span></Tooltip>
  }

  const renderTimetable = (pair) => {
    return isEqual(pair)
      ? renderTimeTableCell(pair[0])
      : <span>{renderTimeTableHalf(pair[0])}{renderTimeTableHalf(pair[1])}</span>
  }

  return (
    <div className="user-board__timetable">
      <div className="user-board__timetable-row"><span className="text">上午</span>&nbsp;&nbsp;{renderTimetable(first)}{renderTimetable(second)}</div>
      <div className="user-board__timetable-row"><span className="text">下午</span>&nbsp;&nbsp;{renderTimetable(third)}{renderTimetable(forth)}</div>
    </div>
  )
}
