import React, { Component } from 'react'
import { connect } from 'react-redux'

import LoginPage from './Login'
import HomePage from './Home'
import NoTeamPage from './NoTeam'
import Header from '../components/root/Header'
import LoadingPage from './Loading'
import * as actions from '../redux/actions'
import ErrorHandler from '../components/root/ErrorHandler'

class RootPage extends Component {
  page (level) {
    switch (level) {
      case 'Anonymous':
        return <LoginPage />
      case 'User':
        return <NoTeamPage />
      case 'Member':
      case 'Admin':
        return <HomePage />
      default:
        return <LoadingPage />
    }
  }

  componentDidMount () {
    this.props.requestsUserStatus()
  }

  render () {
    return (
      <div className='bp3-dark'>
        <ErrorHandler />
        <Header />
        {this.page(this.props.currentUserLevel)}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUserLevel: state.teamtasksStore.currentUser.level
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    requestsUserStatus: () => { dispatch({type: actions.API_USERS_STATUS_REQUEST}) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootPage)
