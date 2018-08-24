import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Elevation, H5, Icon, Spinner, Tabs, Tab, Tooltip, Position, AnchorButton, Button } from '@blueprintjs/core'
import WorkdayCard from './WorkdayCard'
import * as actions from '../../../redux/actions'

class Daily extends Component {
  state = {
    loadings: []
  }

  getWordayState = (workday) => {
    if (!workday) return 'Not started (0/3)'
    if (workday.validated_at) return 'Finished (3/3)'
    if (workday.planned_at) return 'Working on it (2/3)'
    if (workday.created_at) return 'Planning (1/3)'
    return ''
  }

  getWordayIcon = (workday) => {
    if (!workday) return 'delete'
    if (workday.validated_at) return 'tick'
    if (workday.planned_at) return 'log-in'
    if (workday.created_at) return 'log-out'
    return ''
  }

  componentDidMount () {
    this.loadData(this.props)
  }

  loadData = (props) => {
    const actionId = actions.generateActionId()
    props.requestWorkdayList(1, true, actionId)
    this.setState({loadings: [actionId]})
  }

  shouldComponentUpdate (nextProps, nextState) {
    let shouldUpdate = true
    if (JSON.stringify(this.props.filters) !== JSON.stringify(nextProps.filters)) {
      this.loadData(nextProps)
      shouldUpdate = false
    }
    if (JSON.stringify(this.props.workdays.loadings) !== JSON.stringify(nextProps.workdays.loadings)) {
      const loadings = nextState.loadings.filter((actionId) => (
        nextProps.workdays.loadings.indexOf(actionId) > -1
      ))
      this.setState({loadings})
      shouldUpdate = false
    }
    return shouldUpdate
  }

  render () {
    return (
      <div>
        <Card elevation={Elevation.ONE}>
          <H5><Icon icon='flows' /> Daily View <Button icon='refresh' onClick={() => { this.loadData(this.props) }} /></H5>
        </Card>
        <div style={{'paddingTop': '10px'}} />
        <Card elevation={Elevation.ONE}>
          <Tabs vertical defaultSelectedTabId={'-1'}>
            {this.props.users.map((user) => {
              const filteredWorkdays = this.props.workdays.workdays.filter((workday) => (workday.user === user.id))
              const workday = filteredWorkdays.length > 0 ? filteredWorkdays[0] : false
              return <Tab
                id={user.id}
                key={user.id}
                title={
                  <div>
                    <Tooltip content={this.getWordayState(workday)} position={Position.TOP}>
                      <AnchorButton style={{display: 'inline-flex'}} disabled icon={this.getWordayIcon(workday)} size={10} />
                    </Tooltip>
                    &nbsp;
                    {user.django_user.username}
                  </div>
                }
                disabled={filteredWorkdays.length === 0}
                style={{width: '100%'}}
                panel={workday ? <WorkdayCard workday={workday} /> : <div />} />
            })}
            { this.state.loadings.length > 0 && <Tab id='load' disabled title={<Spinner size={15} />} /> }
          </Tabs>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.teamtasksStore.users.users,
    workdays: state.teamtasksStore.workdays
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    requestWorkdayList: (page, resetState, actionId) => {
      dispatch({
        type: actions.API_WORKDAYS_LIST_REQUEST,
        data: {page, ...ownProps.filters},
        actionId,
        resetState
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Daily)
