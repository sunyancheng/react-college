import React from 'react'

export default ({ courses, jumpTo }) => {
  const getUrl = (course) => {
    return course.is_public === '1' ? `/course/detail/${course.course_id}#2` : `/course/detail/${course.course_id}#0`
  }
  return (
    <div className="course-step">
      {courses.map((course, i) => (
        <div key={i} onClick={jumpTo(getUrl(course))} className="course-step__item">
          <span className="course-step__item-name">{course.course}</span>
          <span className="course-step__item-time">{course.ctime}</span>
        </div>
      ))}
    </div>
  )
}
