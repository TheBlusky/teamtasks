import React, { Component } from 'react'
import { Button, FormGroup, InputGroup, Spinner } from '@blueprintjs/core'
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'

class Create extends Component {
  state = {
    teamName: ''
  }

  create = () => {
    let go = true
    if (this.state.teamName === '') {
      this.props.displayError('Team name should not be empty.')
      go = false
    }
    if (go) this.props.requestTeamsCreate(this.state.teamName)
  }

  render () {
    return (
      <div>
        <FormGroup
          label='Team Name'
          labelFor='input-username'>
          <InputGroup
            id='input-teamname'
            placeholder='Enter the team name...'
            value={this.state.teamName}
            onChange={({target}) => { this.setState({teamName: target.value}) }}
            type='text' />
        </FormGroup>
        <div style={{'textAlign': 'center'}}>
          {
            this.props.loading
              ? <Spinner size={30} />
              : <Button onClick={this.create}>Create</Button>
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
    requestTeamsCreate: (teamname) => {
      dispatch({
        type: actions.API_TEAMS_CREATE_REQUEST,
        data: {team_name: teamname}
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
)(Create)
