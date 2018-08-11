import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Elevation, Tooltip, Position, Spinner } from '@blueprintjs/core'

class State extends Component {
  getWordayState = () => {
    if (this.props.workday.workday.validated_at) return 3
    if (this.props.workday.workday.planned_at) return 2
    if (this.props.workday.workday.created_at) return 1
    return -1
  }

  render () {
    return (
      <Card elevation={Elevation.ONE}>
        <ul className='bp3-breadcrumbs'>
          { this.getWordayState() === -1 && <li><Spinner size={30} /></li>}
          <li className={this.getWordayState() === 1 ? 'bp3-breadcrumb-current' : 'bp3-breadcrumb bp3-disabled'}>
            <Tooltip
              content='Planning is the step where you fill what you think you will do this day.'
              position={Position.TOP}>
              Planning
            </Tooltip>
          </li>
          <li className={this.getWordayState() === 2 ? 'bp3-breadcrumb-current' : 'bp3-breadcrumb bp3-disabled'}>
            <Tooltip
              content='Working is the step where you report what you actually did. You can also add unplanned tasks.'
              position={Position.TOP}>
              Working
            </Tooltip>
          </li>
          <li className={this.getWordayState() === 3 ? 'bp3-breadcrumb-current' : 'bp3-breadcrumb bp3-disabled'}>
            <Tooltip
              content='Finished is the step where everything is... well... finished :-)'
              position={Position.TOP}>
              Finished
            </Tooltip>
          </li>
        </ul>
      </Card>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    workday: state.teamtasksStore.currentWorkday
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
