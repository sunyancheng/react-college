import './style.less'
import React from 'react';
import CourseCell from './course-cell'
import { Popover } from 'antd';
import moment from 'moment';

const format = (value, formatter) => {
  if (!value) return;
  var obj = typeof value === 'string' ? moment(value) : value;
  return obj.format(formatter);
}
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

const content = (course) => (
  <div className="timetable-component-course-info-table">
    <p><span>课程名称: </span>{course.name}</p>
    <p><span>任课老师: </span>{course.teacher}</p>
    <p><span>教室名称: </span>{course.classroom}</p>
  </div>
);
export default class extends React.Component {

  static defaultProps = {
    classInfo: {}
  }

  componentDidMount() {
    this.timeDic = [
      {
        sequence: '1-2',
        time: '09:00-10:50'
      },
      {
        sequence: '3-4',
        time: '11:00-13:50'
      },
      {
        sequence: '5-6',
        time: '14:00-15:50'
      },
      {
        sequence: '7-8',
        time: '16:00-17:50'
      },
    ]

  }

  allTime = ['09:00-09:50', '10:00-10:50', '11:00-11:50', '13:00-13:50', '14:00-14:50', '15:00-15:50', '16:00-16:50', '17:00-17:50']

  handleCirriculum = (cirriculums) => {
    const ret = [], colorArray = [];
    cirriculums.forEach((dayCirriculms, day) => {
      dayCirriculms.forEach((course, c) => {
        ret[c] = ret[c] || [];
        ret[c][day] = course;
        course.name && colorArray.indexOf(course.name) === -1 && colorArray.push(course.name);
      });
    })
    return { circulums: ret, nameArray: colorArray };
  }

  renderDay = (classes, rowIndex, rows, nameArray) => {
    let emptySymbol = this.props.readOnly ? '/' : '新增';
    return (
      <tr key={rowIndex}>
        {rowIndex % 2 === 0 ? <td rowSpan={2}><div><span>第{rowIndex + 1} - {rowIndex + 2}节</span><br /><span style={{ fontSize: 12 }}>{this.timeDic[rowIndex / 2].time}</span></div></td> : null}
        {
          classes.map((course, key) => {
            let colorStyle = color[nameArray.indexOf(course.name) % color.length];
            let merged = rowIndex % 2 === 0 && (rows[rowIndex][key] || {}).class_timetable_id === (rows[rowIndex + 1][key] || {}).class_timetable_id;
            let prevMerged = rowIndex > 0 && (rows[rowIndex][key] || {}).class_timetable_id === (rows[rowIndex - 1][key] || {}).class_timetable_id
            if (rowIndex % 2 !== 0 && prevMerged) {
              return null;
            }
            return this.renderCell(course, key, rowIndex, colorStyle, emptySymbol, merged);
          })
        }
      </tr>
    )
  }

  renderNormalDay = (classes, rowIndex) => {
    return (
      <tr key={rowIndex}>
        <td><div><span>第{rowIndex + 1}节</span><br /><span style={{ fontSize: 12 }}>{this.allTime[rowIndex]}</span></div></td>
        {classes.map((clas, key) => <td key={key}><p>{clas.name}</p><p>{clas.teacher}</p><p>{clas.classroom}</p></td>)}

      </tr>
    );
  }

  renderCell = (course, key, rowIndex, colorStyle, emptySymbol, merged) => {
    return (<td rowSpan={merged ? 2 : 1} key={key} >
      {this.renderFirstCourseCell(course, key, rowIndex, colorStyle, emptySymbol, merged)}
      {this.renderShadow(course, colorStyle, merged, rowIndex)}
    </td>)
  }

  renderShadow(course, colorStyle, merged, rowIndex) {
    return course.name && !this.props.readOnly && <div className={`cell-box-shadow ${merged ? ' merged' : ''}`} style={{ top: rowIndex % 2 !== 0 ? 1 : 20, ...colorStyle }}><span onClick={() => this.props.onDelete(course)}>删除</span><span onClick={() => this.props.onEdit(course)}>修改</span></div>
  }

  renderFirstCourseCell = (course, key, rowIndex, colorStyle, emptySymbol, merged) => {
    if (course.name) {
      return this.renderCourseCell(course, colorStyle, merged)
    }
    return this.renderEditableCourseCell(course, key, rowIndex, emptySymbol, merged)
  }

  renderEditableCourseCell = (course, key, rowIndex, emptySymbol, merged) => {
    return <div className={`omit-course  ${merged ? ' merged' : ''} ${this.props.readOnly ? '' : ' editable'}`} onClick={() => !this.props.readOnly && this.props.onAdd({ ...course, start_section: `${rowIndex + 1}`, end_section: `${rowIndex + (merged ? 2 : 1)}`, tdate: format(moment(this.props.data.s_day).add(key, 'day'), 'YYYY-MM-DD') })}>{emptySymbol}</div>;
  }

  renderCourseCell = (course, colorStyle, merged) => {
    let cell = <CourseCell {...course} merged={merged} color={colorStyle} onClick={() => !this.props.readOnly && this.props.onEdit(course)} />
    return <Popover content={content(course)}><div>{cell}</div></Popover>
  }

  handleTimeTable = (timetable) => {
    let s_day = this.props.s_day;
    return timetable.map((day, index) => {
      if (day.length) {
        return day;
      } else {
        return [...Array(8).keys()].map((item, key) => ({ name: '', teacher: '', classroom: '', tdate: format(moment(s_day).add(index, 'day'), 'YYYY-MM-DD'), start_section: key + 1, end_section: (key + 1) }));
      }
    })
  }

  renderHeader = (s_day) => {
    let getDay = (key) => moment(s_day).add(key, 'day')
    return (
      <thead className="curriculum-thead">
      <tr>
        <th />
        {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((item, key) =>
          <th key={key} className={`${key > 4 ? 'shallow ' : ''} ${format(getDay(key), 'MM.DD') === format(moment(), 'MM.DD') ? 'today' : ''}`}><span>{format(getDay(key) , 'MM.DD')}/{item}</span></th>
        )}
      </tr>
    </thead>
    );
  }

  render() {
    let { left, week, data: { s_day, e_day, timetable }, onChange } = this.props;
    let table = this.handleTimeTable(timetable)
    const { circulums, nameArray } = this.handleCirriculum(table)

    // console.log(s_day, e_day, circulums)
    return (
      <section className="timetable-component">
        <header className="timetable-component__header">
          <div className="left">{left}</div>
          {circulums.length > 0 && <div className="center">
            <div className="month-selector">
              <span className="month-selector__left" onClick={() => onChange(format(moment(e_day).subtract(1, 'month').date(1), 'YYYY-MM-DD'))} />
              <span className="content">{format(e_day, 'YYYY.MM')}</span>
              <span className="month-selector__right" onClick={() => onChange(format(moment(e_day).add(1, 'month').date(1), 'YYYY-MM-DD'))} />
            </div>
          </div>}
          {circulums.length > 0 && <div className="right">{week}
            <div className="week-selector">
              <span className="prev" onClick={() => onChange(format(moment(s_day).subtract(1, 'day'), 'YYYY-MM-DD'))}>&lt;</span>
              <span className="content">{format(s_day, 'MM.DD')} ~ {format(e_day, 'MM.DD')}</span>
              <span className="next" onClick={() => onChange(format(moment(e_day).add(1, 'day'), 'YYYY-MM-DD'))}>&gt;</span>
            </div>
          </div>}
        </header>
        <div>
          {circulums.length > 0 &&
          <table className="curriculum-table">
            {this.renderHeader(s_day)}
            <tbody className="curriculum-tbody">
              {
                circulums.map((cirriculum, index) => {
                  return this.renderDay(cirriculum, index, circulums, nameArray)
                })
              }
            </tbody>
          </table>}
          {this.props.printable && <table id="printable-timetable">
            <caption><div style={{ float: 'left', position: 'absolute', fontSize: 12 }}><span>{this.props.classInfo.campus_name}</span>/<span>{this.props.classInfo.major_name}</span>/<span>{this.props.classInfo.class_name}</span></div>课程表</caption>
            {this.renderHeader(s_day)}
            <tbody>
              {
                circulums.map((cirriculum, index) => {
                  return this.renderNormalDay(cirriculum, index, circulums, nameArray)
                })
              }
            </tbody>
          </table>}
        </div>
      </section>
    );
  }
}
