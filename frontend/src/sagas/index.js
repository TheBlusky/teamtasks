import { all } from 'redux-saga/effects'
import apiUsers from './apiUsers'
import errors from './errors'
import apiTeams from './apiTeams'
import apiWorkdays from './apiWorkdays'
import apiTasks from './apiTasks'

function * sagas () {
  yield all([
    apiTasks(),
    apiTeams(),
    apiUsers(),
    apiWorkdays(),
    errors()
  ])
}

export default sagas
