import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Elevation, NonIdealState } from '@blueprintjs/core'

class State extends Component {
  render () {
    return (
      <Card elevation={Elevation.ONE}>
        <NonIdealState
          icon='endorsed'
          title='Workday validated'
          description="Good job ! What time is it ? I think it's beer o' clock" />
      </Card>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(State)
