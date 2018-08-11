import React, { Component } from 'react'
import {Button, FormGroup, InputGroup, Spinner} from '@blueprintjs/core'
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'

class RegisterForm extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordCheck: ''
  }

  register = () => {
    let go = true
    if (this.state.username === '') {
      this.props.displayError('Username should not be empty.')
      go = false
    }
    if (this.state.email === '') {
      this.props.displayError('Email should not be empty.')
      go = false
    }
    if (this.state.password === '') {
      this.props.displayError('Password should not be empty.')
      go = false
    }
    if (this.state.password !== this.state.passwordCheck) {
      this.props.displayError('Passwords mistmatch.')
      go = false
    }
    if (go) this.props.requestUserRegister(this.state)
  }

  render () {
    return (
      <div>
        <FormGroup
          label='Username'
          labelFor='input-username'>
          <InputGroup
            id='input-username'
            placeholder='Enter your username...'
            value={this.state.username}
            onChange={({target}) => { this.setState({username: target.value}) }}
            type='text' />
        </FormGroup>
        <FormGroup
          label='Email'
          labelFor='input-email'>
          <InputGroup
            id='input-email'
            placeholder='Enter your email...'
            value={this.state.email}
            onChange={({target}) => { this.setState({email: target.value}) }}
            type='email' />
        </FormGroup>
        <FormGroup
          label='Password'
          labelFor='input-password'>
          <InputGroup
            id='input-password'
            placeholder='Enter your password...'
            value={this.state.password}
            onChange={({target}) => { this.setState({password: target.value}) }}
            type='password' />
        </FormGroup>
        <FormGroup
          label='Repeat your password'
          labelFor='input-password2'>
          <InputGroup
            id='input-password2'
            placeholder='Repeat your password...'
            value={this.state.passwordCheck}
            onChange={({target}) => { this.setState({passwordCheck: target.value}) }}
            type='password' />
        </FormGroup>
        <div style={{'textAlign': 'center'}}>
          {
            this.props.loading
              ? <Spinner size={30} />
              : <Button onClick={this.register}>Register</Button>
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
    requestUserRegister: ({username, email, password}) => {
      dispatch({
        type: actions.API_USERS_REGISTER_REQUEST,
        data: {username, email, password}
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
)(RegisterForm)
