import React, { Component } from 'react'
import { Grid, Cell } from 'styled-css-grid'
import { Card, Elevation, Tabs, Tab } from '@blueprintjs/core'
import LoginForm from '../components/login/LoginForm'
import RegisterForm from '../components/login/RegisterForm'
import {connect} from 'react-redux'

class LoginPage extends Component {
  render () {
    return (
      <Grid columns={'auto minmax(300px,400px) auto'}>
        <Cell style={{'paddingTop': 10}} width={1} left={2}>
          <Card elevation={Elevation.TWO}>
            <Tabs>
              <Tab id='tab_login' title='Login' panel={<LoginForm />} />
              <Tab id='tab_register' title='Register' disabled={!this.props.canRegister} panel={<RegisterForm />} />
            </Tabs>
          </Card>
        </Cell>
      </Grid>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    canRegister: state.teamtasksStore.currentUser.canRegister
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)
