import { put, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../redux/actions'
import { jsonErrorToString } from '../components/root/ErrorHandler'

function * apiFailure (action) {
  if (action.data) {
    yield put({
      type: actions.ERROR_ADD,
      data: {error: jsonErrorToString(action.data)}
    })
  }
  if (action.error) {
    yield put({
      type: actions.ERROR_ADD,
      data: {error: `JSException: ${action.error}`}
    })
  }
}

export default function * () {
  yield all([
    takeEvery(actions.API_USERS_REGISTER_FAILURE, apiFailure),
    takeEvery(actions.API_USERS_LOGIN_FAILURE, apiFailure),
    takeEvery(actions.API_WORKDAYS_CREATE_FAILURE, apiFailure),
    takeEvery(actions.API_WORKDAYS_VALIDATEPLANNING_FAILURE, apiFailure),
    takeEvery(actions.API_WORKDAYS_VALIDATEWORKING_FAILURE, apiFailure),
    takeEvery(actions.API_TEAMS_ADDUSER_FAILURE, apiFailure),
    takeEvery(actions.API_TASKS_CREATE_FAILURE, apiFailure),
    takeEvery(actions.API_TASKS_UPDATE_FAILURE, apiFailure),
    takeEvery(actions.API_TASKS_UPDATE_FAILURE, apiFailure)
  ])
}
