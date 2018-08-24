import * as actions from '../redux/actions'

const workdays = (state = {workdays: [], loadings: [], pageData: undefined}, action) => {
  switch (action.type) {
    case actions.PAGE_CHANGE:
      if (action.forceClean || JSON.stringify(action.data) !== JSON.stringify(state.pageData)) {
        return {...state, workdays: [], pageData: action.data}
      } else {
        return state
      }
    case actions.API_WORKDAYS_LIST_REQUEST:
      return {
        ...state,
        workdays: action.resetState ? [] : state.workdays,
        loadings: [...state.loadings, action.actionId]
      }
    case actions.API_WORKDAYS_LIST_SUCCESS:
      const currentWorkdaysIds = state.workdays.map((workday) => (workday.id))
      return {
        ...state,
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
        ...state,
        workdays: state.workdays,
        loadings: state.loadings.filter((actionId) => (actionId !== action.actionId))
      }
    default:
      return state
  }
}

export default workdays
