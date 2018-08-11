import { put, takeEvery, all } from 'redux-saga/effects'
import fetch from '../fetch'
import * as actions from '../redux/actions'

function * apiTasksCreate (action) {
  const {actionId} = action
  try {
    const response = yield fetch('/api/tasks/', {}, 'POST', action.data)
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({type: actions.API_TASKS_CREATE_SUCCESS, data: responseJson, actionId})
    } else {
      yield put({type: actions.API_TASKS_CREATE_FAILURE, data: responseJson, actionId})
      yield put({type: actions.API_WORKDAYS_CURRENT_REQUEST})
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_TASKS_CREATE_FAILURE, actionId})
    yield put({type: actions.API_WORKDAYS_CURRENT_REQUEST})
  }
}

function * apiTasksUpdate (action) {
  const {actionId} = action
  try {
    const response = yield fetch(`/api/tasks/${action.data.id}/`, {}, 'PUT', action.data)
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({type: actions.API_TASKS_UPDATE_SUCCESS, data: responseJson, actionId})
    } else {
      yield put({type: actions.API_TASKS_UPDATE_FAILURE, data: responseJson, actionId})
      yield put({type: actions.API_WORKDAYS_CURRENT_REQUEST})
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_TASKS_UPDATE_FAILURE, actionId})
    yield put({type: actions.API_WORKDAYS_CURRENT_REQUEST})
  }
}

export default function * () {
  yield all([
    takeEvery(actions.API_TASKS_CREATE_REQUEST, apiTasksCreate),
    takeEvery(actions.API_TASKS_UPDATE_REQUEST, apiTasksUpdate)
  ])
}
