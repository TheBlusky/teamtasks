import React, { Component } from 'react'
import { Button, Spinner } from '@blueprintjs/core'
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'

class Join extends Component {
  render () {
    return (
      <div>
        To join a team, ask an admin to add you
        <div style={{'textAlign': 'center'}}>
          {
            this.props.loading
              ? <Spinner size={30} />
              : <Button onClick={this.props.requestUserStatus}>Refresh</Button>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.teamtasksStore.currentUser.loading
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    requestUserStatus: () => {
      dispatch({type: actions.API_USERS_STATUS_REQUEST})
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Join)
