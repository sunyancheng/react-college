import React from 'react'
import Base from 'common/base'
import Banner from 'common/banner'

const getTheme = (role) =>  {
  return role.includes(2) ? 'paid' : 'register'
}
const showSlogan = (role) => {
 return role.some(r => [1,2].includes(r)) ? '撸起袖子加油学' : ''
}

export default (class extends Base {
  render() {
    const {role} = this.props
    return (
      <Banner
        theme={getTheme(role)}
        slogan={showSlogan(role)}
      />
    )
  }
}).connect(state => {
  const {role=[]} = state.app.userInfo
  return {
    role
  }
})
