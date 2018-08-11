import * as actions from '../redux/actions'

const workdays = (state = {workdays: [], loadings: []}, action) => {
  switch (action.type) {
    case actions.API_WORKDAYS_LIST_REQUEST:
      return {
        workdays: action.resetState ? [] : state.workdays,
        loadings: [...state.loadings, action.actionId]
      }
    case actions.API_WORKDAYS_LIST_SUCCESS:
      const currentWorkdaysIds = state.workdays.map((workday) => (workday.id))
      return {
        workdays: [
          ...state.workdays,
          ...action.data.data.filter((task) => (
            currentWorkdaysIds.indexOf(task.id) === -1
          ))
        ],
        loadings: state.loadings.filter((actionId) => (actionId !== action.actionId))
      }
    case actions.API_WORKDAYS_LIST_FAILURE:
      return {
        workdays: state.workdays,
        loadings: state.loadings.filter((actionId) => (actionId !== action.actionId))
      }
    default:
      return state
  }
}

export default workdays
