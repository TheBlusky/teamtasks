import React, { Component } from 'react'
import { connect } from 'react-redux'
import State from './State'
import Planning from './Planning'
import Working from './Working'
import Finished from './Finished'
import Loading from './Loading'

class CurrentWorkdayEdit extends Component {
  render () {
    return (
      <div>
        <State />
        <div style={{'paddingTop': '10px'}} />
        { this.props.currentWorkday && (this.props.currentWorkday.workday.validated_at
          ? <Finished />
          : (this.props.currentWorkday.workday.planned_at
            ? <Working />
            : (this.props.currentWorkday.workday.created_at
              ? <Planning />
              : <Loading />
            )
          )
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentWorkday: state.teamtasksStore.currentWorkday
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentWorkdayEdit)
