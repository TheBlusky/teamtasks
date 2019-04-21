import React, { Component } from 'react'
import { Button, FormGroup, InputGroup, Spinner } from '@blueprintjs/core'
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'

class LoginForm extends Component {
  state = {
    username: '',
    password: ''
  }

  login = (event) => {
    if (event) {
      event.preventDefault()
    }
    let go = true
    if (this.state.username === '') {
      this.props.displayError('Username should not be empty.')
      go = false
    }
    if (this.state.password === '') {
      this.props.displayError('Password should not be empty.')
      go = false
    }
    if (go) this.props.requestUserLogin(this.state)
  }

  render () {
    return (
      <div>
        <form onSubmit={this.login}>
          <FormGroup
            label='Username'
            labelFor='input-l-username'>
            <InputGroup
              id='input-l-username'
              placeholder='Enter your username...'
              value={this.state.username}
              onChange={({target}) => { this.setState({username: target.value}) }}
              type='text' />
          </FormGroup>
          <FormGroup
            label='Password'
            labelFor='input-l-password'>
            <InputGroup
              id='input-l-password2'
              placeholder='Enter your password...'
              value={this.state.password}
              onChange={({target}) => { this.setState({password: target.value}) }}
              type='password' />
          </FormGroup>
          <div style={{'textAlign': 'center'}}>
            {
              this.props.loading
                ? <Spinner size={30} />
                : <Button type='submit' >Login</Button>
            }
          </div>
        </form>
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
    requestUserLogin: ({username, password}) => {
      dispatch({
        type: actions.API_USERS_LOGIN_REQUEST,
        data: {username, password}
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
)(LoginForm)
