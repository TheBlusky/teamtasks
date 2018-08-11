import { put, takeEvery, all } from 'redux-saga/effects'
import fetch from '../fetch'
import * as actions from '../redux/actions'

function * apiWorkdaysCreate (action) {
  const {actionId} = action
  try {
    const response = yield fetch('/api/workdays/', {}, 'POST', action.data)
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({type: actions.API_WORKDAYS_CREATE_SUCCESS, data: responseJson, actionId})
    } else {
      yield put({type: actions.API_WORKDAYS_CREATE_FAILURE, data: responseJson, actionId})
      yield put({type: actions.API_WORKDAYS_CURRENT_REQUEST})
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_WORKDAYS_CREATE_FAILURE, actionId})
    yield put({type: actions.API_WORKDAYS_CURRENT_REQUEST})
  }
}

function * apiWorkdaysList (action) {
  const {actionId} = action
  try {
    const response = yield fetch('/api/workdays/', action.data)
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({type: actions.API_WORKDAYS_LIST_SUCCESS, data: responseJson, actionId})
    } else {
      yield put({type: actions.API_WORKDAYS_LIST_FAILURE, data: responseJson, actionId})
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_WORKDAYS_LIST_FAILURE, actionId})
  }
}

function * apiWorkdaysValidatePlanning (action) {
  const {actionId} = action
  try {
    const response = yield fetch('/api/workdays/validate_planning/', {}, 'POST')
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({type: actions.API_WORKDAYS_VALIDATEPLANNING_SUCCESS, data: responseJson, actionId})
    } else {
      yield put({type: actions.API_WORKDAYS_VALIDATEPLANNING_FAILURE, data: responseJson, actionId})
      yield put({type: actions.API_WORKDAYS_CURRENT_REQUEST})
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_WORKDAYS_VALIDATEPLANNING_FAILURE, actionId})
    yield put({type: actions.API_WORKDAYS_CURRENT_REQUEST})
  }
}

function * apiWorkdaysValidateWorking (action) {
  const {actionId} = action
  try {
    const response = yield fetch('/api/workdays/validate_working/', {}, 'POST')
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({type: actions.API_WORKDAYS_VALIDATEWORKING_SUCCESS, data: responseJson, actionId})
    } else {
      yield put({type: actions.API_WORKDAYS_VALIDATEWORKING_FAILURE, data: responseJson, actionId})
      yield put({type: actions.API_WORKDAYS_CURRENT_REQUEST})
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_WORKDAYS_VALIDATEWORKING_FAILURE, actionId})
    yield put({type: actions.API_WORKDAYS_CURRENT_REQUEST})
  }
}

function * apiWorkdaysCurrent (action) {
  const {actionId} = action
  try {
    const response = yield fetch('/api/workdays/current/')
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({type: actions.API_WORKDAYS_CURRENT_SUCCESS, data: responseJson, actionId})
    } else {
      yield put({type: actions.API_WORKDAYS_CURRENT_FAILURE, data: responseJson, actionId})
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_WORKDAYS_CURRENT_FAILURE, actionId})
  }
}

export default function * () {
  yield all([
    takeEvery(actions.API_WORKDAYS_CREATE_REQUEST, apiWorkdaysCreate),
    takeEvery(actions.API_WORKDAYS_LIST_REQUEST, apiWorkdaysList),
    takeEvery(actions.API_WORKDAYS_CURRENT_REQUEST, apiWorkdaysCurrent),
    takeEvery(actions.API_WORKDAYS_VALIDATEPLANNING_REQUEST, apiWorkdaysValidatePlanning),
    takeEvery(actions.API_WORKDAYS_VALIDATEWORKING_REQUEST, apiWorkdaysValidateWorking)
  ])
}
