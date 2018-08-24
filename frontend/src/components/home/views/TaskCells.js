import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Checkbox, Tooltip, Position, AnchorButton } from '@blueprintjs/core'
import { Cell } from 'styled-css-grid'

class TaskCells extends Component {
  render () {
    const { task } = this.props
    return ([
      <Cell key={1}>
        { task.planned
          ? <Tooltip
            content={task.comments_planning || (<i>Empty</i>)}
            position={Position.RIGHT}>
            <AnchorButton
              className='bp3-small'
              disabled={task.comments_planning === null || task.comments_planning === ''}
              icon='log-out' />
          </Tooltip>
          : <div />
        }
      </Cell>,
      <Cell key={2}>
        { this.props.workdayPlannedAt
          ? <Tooltip
            content={task.comments_validation || (<i>Empty</i>)}
            position={Position.RIGHT}>
            <AnchorButton
              disabled={task.comments_validation === null || task.comments_validation === ''}
              className='bp3-small'
              icon='log-in' />
          </Tooltip>
          : <div />
        }
      </Cell>,
      <Cell key={3}>
        <Checkbox checked={task.done} />
      </Cell>,
      <Cell key={4}>
        {task.label}
      </Cell>
    ])
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
)(TaskCells)
