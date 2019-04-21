import React, { Component } from 'react'
import { Classes, Menu as BPMenu, MenuDivider, MenuItem, Spinner, Button } from '@blueprintjs/core'
import connect from 'react-redux/es/connect/connect'
import moment from 'moment'
import * as actions from '../../../redux/actions'
import { EDIT_WORKDAY } from '../../../reducers/displayedPage'

const TODAY = 0

class Workday extends Component {
  createWorkday = (when) => {
    const day = ((when === TODAY) ? moment() : moment().add(1, 'day')).format('YYYY-MM-DD')
    this.props.requestWorkdayCreate(day)
  }

  getWordayState = () => {
    if (this.props.workday.workday.validated_at) return 'Finished (3/3)'
    if (this.props.workday.workday.planned_at) return 'Working on it (2/3)'
    if (this.props.workday.workday.created_at) return 'Planning (1/3)'
    return 'You should not see this'
  }

  render () {
    return (
      <BPMenu className={Classes.ELEVATION_1}>
        <MenuDivider title={<div>
          <span style={{float: 'left'}}>Current workday</span>
          <span style={{float: 'right'}}>
            <Button loading={this.props.workday.loading} small icon='refresh' onClick={this.props.refresh} />
          </span>
        </div>} />
        {
          this.props.workday.loading
            ? <MenuItem text={<Spinner size={15} />} />
            : this.props.workday.workday
              ? [
                <MenuItem key={1} icon='calendar' text='Workday' label={this.props.workday.workday.day}
                  onClick={this.props.loadPage} />,
                <MenuItem key={2} icon='clipboard' text='Status' label={this.getWordayState()}
                  onClick={this.props.loadPage} />,
                <MenuItem key={3} icon='time' text='Time' label='Right on time'
                  onClick={this.props.loadPage} />,
                !this.props.workday.workday.validated_at
                  ? <MenuItem key={4} icon='arrow-right' text='Edit'
                    onClick={this.props.loadPage} />
                  : <MenuItem key={5} icon='edit' text='Plan another day'>
                    <MenuItem key={6} icon='play' text='Tasks for today'
                      onClick={() => this.createWorkday(TODAY)} />
                  </MenuItem>
              ]
              : [
                <MenuItem key={9} icon='play' text='Create tasks for today'
                  onClick={() => this.createWorkday(TODAY)} />
              ]
        }
      </BPMenu>
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
    requestWorkdayCreate: (day) => {
      console.log('Hotdebug #1')
      dispatch({
        type: actions.API_WORKDAYS_CREATE_REQUEST,
        data: {day}
      })
    },
    loadPage: () => {
      dispatch({
        type: actions.PAGE_CHANGE,
        data: {page: EDIT_WORKDAY}
      })
    },
    refresh: () => {
      dispatch({type: actions.API_WORKDAYS_CURRENT_REQUEST})
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workday)
