import React, { Component } from 'react'
import { Classes, Menu as BPMenu, MenuDivider, MenuItem, Spinner } from '@blueprintjs/core'
import connect from 'react-redux/es/connect/connect'
import moment from 'moment'
import * as actions from '../../../redux/actions'
import { EDIT_WORKDAY } from '../../../reducers/displayedPage'

const TODAY = 0
const TOMORROW = 1

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
        <MenuDivider title='Current workday' />
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
                    <MenuItem key={7} icon='fast-forward' text='Tasks for tomorrow'
                      onClick={() => this.createWorkday(TOMORROW)} />
                  </MenuItem>
              ]
              : <MenuItem key={8} icon='edit' text='Start planning'>
                <MenuItem key={9} icon='play' text='Tasks for today'
                  onClick={() => this.createWorkday(TODAY)} />
                <MenuItem key={10} icon='fast-forward' text='Tasks for tomorrow'
                  onClick={() => this.createWorkday(TOMORROW)} />
              </MenuItem>
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workday)
