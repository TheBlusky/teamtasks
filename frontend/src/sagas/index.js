import { all } from 'redux-saga/effects'
import apiUsers from './apiUsers'
import errors from './errors'
import apiTeams from './apiTeams'
import apiWorkdays from './apiWorkdays'
import apiTasks from './apiTasks'
import gamification from './gamification'
import ping from './ping'

function * sagas () {
  yield all([
    apiTasks(),
    apiTeams(),
    apiUsers(),
    apiWorkdays(),
    gamification(),
    ping(),
    errors()
  ])
}

export default sagas
