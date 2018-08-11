import { put, takeEvery, all } from 'redux-saga/effects'
import fetch from '../fetch'
import * as actions from '../redux/actions'

function * apiTeamsCreate (action) {
  const {actionId} = action
  try {
    const response = yield fetch('/api/teams/', {}, 'POST', action.data)
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({
        type: actions.API_TEAMS_CREATE_SUCCESS,
        data: responseJson,
        actionId
      })
      yield put({
        type: actions.API_USERS_STATUS_REQUEST
      })
    } else {
      yield put({
        type: actions.API_TEAMS_CREATE_FAILURE,
        data: responseJson,
        actionId
      })
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_TEAMS_CREATE_FAILURE, actionId})
  }
}

function * apiTeamsAddUser (action) {
  const {actionId} = action
  try {
    const response = yield fetch('/api/teams/add_user/', {}, 'POST', action.data)
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({type: actions.API_TEAMS_ADDUSER_SUCCESS, data: responseJson, actionId})
    } else {
      yield put({type: actions.API_TEAMS_ADDUSER_FAILURE, data: responseJson, actionId})
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_TEAMS_ADDUSER_FAILURE, actionId})
  }
}

export default function * () {
  yield all([
    takeEvery(actions.API_TEAMS_CREATE_REQUEST, apiTeamsCreate),
    takeEvery(actions.API_TEAMS_ADDUSER_REQUEST, apiTeamsAddUser)
  ])
}
