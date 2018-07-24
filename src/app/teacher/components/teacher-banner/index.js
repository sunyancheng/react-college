import React from 'react'
import Base from 'common/base'
import Banner from 'common/banner'
import actions from 'teacher/actions/teacher'

 const getTheme = (level) => {
  if (level === '1') {
    return 'teacher primary-level'
  } else if (level === '2') {
    return 'teacher middle-level'
  } else if (level === '3') {
    return 'teacher high-level'
  }
  return 'teacher'
}

export default (class extends Base {
  componentDidMount() {
    this.dispatch(actions.getTeacherInfo())
  }
  render() {
    const {level} = this.props
    return (
      <Banner
        theme={getTheme(level)}
        slogan={'新的一天，撸起袖子加油教'}
      />
    )
  }
}).connect(state => {
  const {teacherInfo} = state.app
  return {
    level: teacherInfo ? teacherInfo.level : '1'
  }
})
