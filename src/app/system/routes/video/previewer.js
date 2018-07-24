import React from 'react'
import Video from 'user/routes/major/course/video'

export default ({ url }) => {
  return (
    <div style={{ width: '100%', height: '290px' }}>
      <Video
        url={url[0]}
        toolbar
        enableControlBar={{
          list: [{ name: '标清', src: `${url[0]}` }, { name: '高清', src: `${url[1]}` }],
          create() {
            this.$dom.className = this.$dom.className + ' hover-layer'
            this.option.width = '4em'
          },
          immediate: true,
          duration: -2,
          repeatTimes: 2,
          event: {
            click: () => {
              // this.hideMask()
              console.log('click');
            }
          }
        }}
      />
    </div>
  )
}
