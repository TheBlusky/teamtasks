/* eslint-disable camelcase */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Elevation, Menu, H5, MenuItem, Icon } from '@blueprintjs/core'
import { Cell, Grid } from 'styled-css-grid'
import TaskCells from './TaskCells'

class WorkdayCard extends Component {
  getWordayState = () => {
    if (this.props.workday.validated_at) return 'Finished (3/3)'
    if (this.props.workday.planned_at) return 'Working on it (2/3)'
    if (this.props.workday.created_at) return 'Planning (1/3)'
    return 'You should not see this'
  }

  render () {
    const { day, created_at, planned_at, validated_at, user, task_set } = this.props.workday
    const filteredUsers = this.props.users.filter(({id}) => (id === user))
    const userName = filteredUsers.length === 0 ? <i>?</i> : filteredUsers[0].django_user.username
    return (
      <Card elevation={Elevation.ONE}>
        <H5><Icon icon='person' /> {userName}</H5>
        <Grid columns={'300px 1fr'}>
          <Cell>
            <Menu>
              <MenuItem icon='calendar' text='Workday' label={day} />
              <MenuItem icon='clipboard' text='Status' label={this.getWordayState()} />
              <MenuItem icon='time' text='Time' label='Right on time' />
              <MenuItem
                icon='log-out'
                text='Created at'
                label={created_at ? created_at.split('.')[0] : 'N/A'} />
              <MenuItem
                icon='flows'
                text='Planned at'
                label={planned_at ? planned_at.split('.')[0] : 'N/A'} />
              <MenuItem
                icon='log-in'
                text='Finished at'
                label={validated_at ? validated_at.split('.')[0] : 'N/A'} />
            </Menu>
          </Cell>
          <Cell>
            <Grid columns={'20px 20px 20px 1fr'}>
              { task_set.map((task) => (<TaskCells key={task.id} task={task} />)) }
            </Grid>
          </Cell>
        </Grid>
      </Card>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.teamtasksStore.users.users
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkdayCard)
