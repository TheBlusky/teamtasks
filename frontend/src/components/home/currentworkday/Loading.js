import React, { Component } from 'react'
import { Spinner, Card, Elevation } from '@blueprintjs/core'

class Loading extends Component {
  render () {
    return (
      <Card elevation={Elevation.TWO} style={{'textAlign': 'center'}}>
        <Spinner size={100} />
      </Card>
    )
  }
}

export default Loading
