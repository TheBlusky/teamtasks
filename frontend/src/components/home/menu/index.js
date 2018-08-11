import React, { Component } from 'react'
import Admin from './Admin'
import Views from './Views'
import Workday from './Workday'
import CurrentUser from './CurrentUser'

class Menu extends Component {
  render () {
    return (
      <div>
        <CurrentUser />
        <div style={{'padding': '10px'}} />
        <Workday />
        <div style={{'padding': '10px'}} />
        <Views />
        <div style={{'padding': '10px'}} />
        <Admin />
      </div>
    )
  }
}

export default Menu
