import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Elevation, H5, Icon, Spinner } from '@blueprintjs/core'
import WorkdayCard from './WorkdayCard'
import * as actions from '../../../redux/actions'

class Flow extends Component {
  state = {
    loadings: []
  }

  componentDidMount () {
    const actionId = actions.generateActionId()
    this.props.requestWorkdayList(1, true, actionId)
    this.setState({loadings: [actionId]})
  }

  shouldComponentUpdate (nextProps, nextState) {
    let shouldUpdate = true
    if (JSON.stringify(this.props.filters) !== JSON.stringify(nextProps.filters)) {
      this.componentDidMount()
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
          <H5><Icon icon='flows' /> Flow View</H5>
        </Card>
        { this.props.workdays.workdays.map((workday) => ([
          <div key={1} style={{'paddingTop': '10px'}} />,
          <WorkdayCard key={2} workday={workday} />
        ]))}
        { this.state.loadings.length > 0 && [
          <div key={1} style={{'paddingTop': '10px'}} />,
          <Card key={2} elevation={Elevation.ONE}>
            <div style={{'textAlign': 'center'}}>
              <Spinner size={30} />
            </div>
          </Card>
        ]}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
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
)(Flow)
