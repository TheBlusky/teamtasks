import React, { Component } from 'react'
import {Button, Spinner} from '@blueprintjs/core'
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'

class Header extends Component {
  render () {
    return (
      <nav className='bp3-navbar bp3-dark'>
        <div className='bp3-navbar-group bp3-align-left'>
          <div className='bp3-navbar-heading'>Teamtasks</div>
          {(this.props.usersListLoading) && <Spinner size={30} /> }
        </div>
        {
          this.props.currentUser.level && this.props.currentUser.level !== 'Anonymous' &&
          <div className='bp3-navbar-group bp3-align-right'>
            {`${this.props.currentUser.user.username} | ${this.props.currentUser.user.team_name || 'No Team'}`}
            <Button onClick={this.props.requestsUserLogout} className='bp3-button bp3-minimal bp3-icon-log-out' />
          </div>
        }
      </nav>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.teamtasksStore.currentUser,
    usersListLoading: state.teamtasksStore.users.loading
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    requestsUserLogout: () => { dispatch({type: actions.API_USERS_LOGOUT_REQUEST}) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
