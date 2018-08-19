import { put, takeEvery, all } from 'redux-saga/effects'
import fetch from '../fetch'
import * as actions from '../redux/actions'

function * apiGamification (action) {
  try {
    const response = yield fetch('/gamification/', action.data, 'GET')
    const responseJson = yield response.json()
    if (response.ok) {
      yield put({type: actions.GAMIFICATION_SUCCESS, data: responseJson})
    } else {
      console.log('Gamification failure')
      yield put({type: actions.GAMIFICATION_FAILURE})
    }
  } catch (error) {
    console.log(error)
    yield put({type: actions.GAMIFICATION_FAILURE})
  }
}

function * hookUpdateGamification (action) {
  yield put({type: actions.GAMIFICATION_REQUEST})
}

export default function * () {
  yield all([
    takeEvery(actions.GAMIFICATION_REQUEST, apiGamification),
    takeEvery(actions.API_WORKDAYS_VALIDATEPLANNING_SUCCESS, hookUpdateGamification),
    takeEvery(actions.API_WORKDAYS_VALIDATEWORKING_SUCCESS, hookUpdateGamification),
    takeEvery(actions.API_WORKDAYS_VALIDATEPLANNING_FAILURE, hookUpdateGamification),
    takeEvery(actions.API_WORKDAYS_VALIDATEWORKING_FAILURE, hookUpdateGamification)
  ])
}
