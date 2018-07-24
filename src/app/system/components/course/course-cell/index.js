import React from 'react'
import CourseTitle from 'system/components/course/course-title'
import Icon from 'common/icon'
import './style.less'
import Table from 'common/page/page-table/table'
import {BtnGroup, Btn} from 'common/button-group'

export default ({config, data, selectId, onClick}) => {
  const { title, number } = config

  const generateColumns = (title) => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        render: (data) => {
          return (<div>{data.index}</div>)
        }
      },{
        title: `${title}名称`,
        dataIndex: 'name',
        render: (data) => {
          return (
            <div style={{lineHeight: '24px'}}>
              <Icon style={{color: '#03AE64', marginRight: 10}} type="video1"/>
              <span>{data.name}</span>
            </div>
          )
        }
      },{
        title: '操作',
        dataIndex: 'operation',
        render: (data) => {
          return (
            <BtnGroup>
              <Btn onClick={() => {console.log(data.operation)}}>{data.operation}</Btn>
            </BtnGroup>
          )
        }
      }
    ]
  }

  const renderNoCourse = () => {
    return [
      <Icon key="icon" className="course-cell-layout__content-icon" type={config.omit} />,
      <div key="desc" className="course-cell-layout__content-desc">你还没有添加任何{title}哦~</div>
    ]
  }

  const renderCourse = () => {
    return (
      <Table columns={generateColumns(title)} data={data} selectId={selectId} />
    )
  }

  const handleClick = () => {
    console.log('clicked')
    onClick()
  }

  return (
    <CourseCellLayout>
      <CourseCellHeader>
        <CourseTitle onClick={handleClick} title={title} number={number} />
      </CourseCellHeader>
      <CourseCellContent>
        {!!config.number ? renderCourse() : renderNoCourse()}
      </CourseCellContent>
    </CourseCellLayout>
  )
}




const CourseCellLayout = ({children}) => <div className="course-cell-layout">{children}</div>
const CourseCellHeader = ({children}) => <div className="course-cell-layout__header">{children}</div>
const CourseCellContent = ({children}) => <div className="course-cell-layout__content">{children}</div>
