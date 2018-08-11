import React, { Component } from 'react'
import { Classes, Dialog, FormGroup, InputGroup, Spinner, Button } from '@blueprintjs/core'
import * as actions from '../../../redux/actions'
import { connect } from 'react-redux'

class AddUser extends Component {
  state = {
    username: ''
  }

  handleClose = () => {
    this.setState({username: ''})
    this.props.close()
  }

  addUser = () => {
    let go = true
    if (this.state.username === '') {
      this.props.displayError('Username should not be empty.')
      go = false
    }
    if (go) this.props.requestTeamsAddUser(this.state.username)
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.addUserState.loading && !nextProps.addUserState.loading && nextProps.addUserState.success) {
      this.handleClose()
    }
    return true
  }

  render () {
    return (
      <Dialog
        onClose={this.handleClose} isOpen={this.props.isOpen}
        className={Classes.DARK}
        title='Add a user to your team'>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label='Username'
            labelFor='input-username'>
            <InputGroup
              id='input-username'
              placeholder='Enter user name...'
              value={this.state.username}
              onChange={({target}) => { this.setState({username: target.value}) }}
              type='text' />
          </FormGroup>
        </div>
        <div style={{'textAlign': 'center'}} className={Classes.DIALOG_FOOTER}>
          {
            this.props.addUserState.loading
              ? <Spinner size={30} />
              : <Button onClick={this.addUser}>Add</Button>
          }
        </div>
      </Dialog>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    addUserState: state.teamtasksStore.team.addUser
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    requestTeamsAddUser: (username) => {
      dispatch({
        type: actions.API_TEAMS_ADDUSER_REQUEST,
        data: {username}
      })
    },
    displayError: (error) => {
      dispatch({
        type: actions.ERROR_ADD,
        data: {error}
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUser)
