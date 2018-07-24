import React from 'react'
export const renderLectureSize = (size) => {
  if (size < 1) {
    return <span>1 K</span>
  }
  else if (1 <= size && size < 1024) {
    return <span>{size}K</span>
  }
  else if(size >= 1024) {
    return <span>{(size / 1024).toFixed(2)}M</span>
  }
}
