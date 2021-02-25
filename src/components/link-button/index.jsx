import React from 'react'
import './index.less'
export default function LinkButton (props) {
    return (
      <div>
        <button className = 'link-button' {...props}>{props.children}</button>
      </div>
    )
  }
