import React from 'react'

export default ({info, index, text}) => {
  return <div style={{marginBottom: '10px'}}>{index+1}.（{text}）&nbsp;&nbsp;{info.title}（{info.score}分）</div>
}
