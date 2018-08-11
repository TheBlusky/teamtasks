import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Checkbox, Tooltip, Position, Button } from '@blueprintjs/core'
import { Cell } from 'styled-css-grid'
import * as Classes from '@blueprintjs/core/lib/esm/common/classes'

class TaskCells extends Component {
  render () {
    const { task } = this.props
    return ([
      <Cell key={1}>
        { task.planned
          ? <Tooltip
            className={Classes.TOOLTIP_INDICATOR}
            content={task.comments_planning || (<i>Empty</i>)}
            position={Position.RIGHT}>
            <Button className='bp3-small' icon='log-out' />
          </Tooltip>
          : <div />
        }
      </Cell>,
      <Cell key={2}>
        { (task.comments_validation !== null)
          ? <Tooltip
            className={Classes.TOOLTIP_INDICATOR}
            content={task.comments_validation || (<i>Empty</i>)}
            position={Position.RIGHT}>
            <Button className='bp3-small' icon='log-in' />
          </Tooltip>
          : <Button className='bp3-small' disabled icon='log-in' />
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
