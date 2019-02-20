import { put, takeEvery, all } from 'redux-saga/effects'
import fetch from '../fetch'
import * as actions from '../redux/actions'

function * apiGamificationGetPing (action) {
  try {
    const response = yield fetch('/gamification/ping_user/')
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({type: actions.API_GAMIFICATION_GETPING_SUCCESS, data: responseJson})
    } else {
      console.log('Get ping failure')
      yield put({type: actions.API_GAMIFICATION_GETPING_FAILURE})
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_GAMIFICATION_GETPING_FAILURE})
  }
}

function * apiGamificationSendPing (action) {
  try {
    const {username} = action.data
    const response = yield fetch('/gamification/ping_user/', {}, "post", {username})
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({type: actions.API_GAMIFICATION_SENDPING_SUCCESS, data: responseJson})
      yield put({type: actions.API_GAMIFICATION_GETPING_REQUEST})
    } else {
      console.log('Send ping failure')
      yield put({type: actions.API_GAMIFICATION_SENDPING_FAILURE})
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.API_GAMIFICATION_SENDPING_FAILURE})
  }
}

export default function * () {
  yield all([
    takeEvery(actions.API_GAMIFICATION_GETPING_REQUEST, apiGamificationGetPing),
    takeEvery(actions.API_GAMIFICATION_SENDPING_REQUEST, apiGamificationSendPing)
  ])
}
