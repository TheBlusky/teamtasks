import React, { Component } from 'react'
import { NonIdealState, Card, Elevation, Button } from '@blueprintjs/core'
import { fortuneHome } from '../../fortune'

class Home extends Component {
  state = {
    fortune: this.newFortune()
  }

  newFortune () {
    return fortuneHome[Math.floor(Math.random() * fortuneHome.length)]
  }
  render () {
    return (
      <Card elevation={Elevation.ONE}>
        <NonIdealState
          icon='take-action'
          title='Team tasks'
          description={this.state.fortune}
          action={<Button icon='refresh' onClick={() => this.setState({fortune: this.newFortune()})} />} />
      </Card>
    )
  }
}

export default Home
