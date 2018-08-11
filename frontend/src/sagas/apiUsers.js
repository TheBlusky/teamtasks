import { put, takeEvery, all } from 'redux-saga/effects'
import fetch from '../fetch'
import * as actions from '../redux/actions'

function * apiUsersStatus (action) {
  const {actionId} = action
  try {
    const response = yield fetch('/api/users/status/')
    const responseJson = yield response.json()
    yield put({
      type: response.ok
        ? actions.API_USERS_STATUS_SUCCESS
        : actions.API_USERS_STATUS_FAILURE,
      data: responseJson,
      actionId
    })
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_USERS_STATUS_FAILURE, actionId})
  }
}

function * apiUsersRegister (action) {
  const {actionId} = action
  try {
    const response = yield fetch('/api/users/register/', {}, 'POST', action.data)
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({
        type: actions.API_USERS_REGISTER_SUCCESS,
        data: responseJson,
        actionId
      })
      yield put({
        type: actions.API_USERS_LOGIN_REQUEST,
        data: action.data
      })
    } else {
      yield put({
        type: actions.API_USERS_REGISTER_FAILURE,
        data: responseJson,
        actionId
      })
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_USERS_REGISTER_FAILURE, error, actionId})
  }
}

function * apiUsersLogin (action) {
  const {actionId} = action
  try {
    const response = yield fetch('/api/users/login/', {}, 'POST', action.data)
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({
        type: actions.API_USERS_LOGIN_SUCCESS,
        data: responseJson,
        actionId
      })
      yield put({
        type: actions.API_USERS_STATUS_REQUEST
      })
    } else {
      yield put({
        type: actions.API_USERS_LOGIN_FAILURE,
        data: responseJson,
        actionId
      })
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_USERS_LOGIN_FAILURE, error}, actionId)
  }
}

function * apiUsersLogout (action) {
  const {actionId} = action
  try {
    const response = yield fetch('/api/users/logout/', {}, 'POST')
    const responseJson = yield response.json()
    yield put({
      type: response.ok
        ? actions.API_USERS_LOGOUT_SUCCESS
        : actions.API_USERS_LOGOUT_FAILURE,
      data: responseJson,
      actionId
    })
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_USERS_LOGOUT_FAILURE, error, actionId})
  }
  yield put({
    type: actions.API_USERS_STATUS_REQUEST,
    actionId
  })
}

function * apiUsersList (action) {
  const {actionId} = action
  try {
    const response = yield fetch('/api/users/')
    const responseJson = yield response.json()
    yield put({
      type: response.ok
        ? actions.API_USERS_LIST_SUCCESS
        : actions.API_USERS_LIST_FAILURE,
      data: responseJson,
      actionId
    })
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_USERS_LIST_FAILURE, error, actionId})
  }
}

export default function * () {
  yield all([
    takeEvery(actions.API_USERS_STATUS_REQUEST, apiUsersStatus),
    takeEvery(actions.API_USERS_REGISTER_REQUEST, apiUsersRegister),
    takeEvery(actions.API_USERS_LOGIN_REQUEST, apiUsersLogin),
    takeEvery(actions.API_USERS_LOGOUT_REQUEST, apiUsersLogout),
    takeEvery(actions.API_USERS_LIST_REQUEST, apiUsersList)
  ])
}
