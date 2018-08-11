import * as actions from '../redux/actions'

const currentWorkday = (state = {workday: false, loading: true, addTaskLoading: [], updateTaskLoading: []}, action) => {
  switch (action.type) {
    case actions.API_WORKDAYS_CURRENT_REQUEST:
    case actions.API_WORKDAYS_VALIDATEPLANNING_REQUEST:
    case actions.API_WORKDAYS_VALIDATEWORKING_REQUEST:
      return {...state, loading: true, workday: false}
    case actions.API_WORKDAYS_CURRENT_SUCCESS:
    case actions.API_WORKDAYS_VALIDATEPLANNING_SUCCESS:
    case actions.API_WORKDAYS_VALIDATEWORKING_SUCCESS:
      return {...state, loading: false, workday: action.data.data}
    case actions.API_WORKDAYS_CURRENT_FAILURE:
    case actions.API_WORKDAYS_VALIDATEPLANNING_FAILURE:
    case actions.API_WORKDAYS_VALIDATEWORKING_FAILURE:
      return {...state, loading: false, workday: false}

    case actions.API_WORKDAYS_CREATE_REQUEST:
      return {...state, loading: true}
    case actions.API_WORKDAYS_CREATE_SUCCESS:
      return {...state, loading: false, workday: action.data.data}

    case actions.API_TASKS_CREATE_REQUEST:
      return {...state, addTaskLoading: [...state.addTaskLoading, action.actionId]}
    case actions.API_TASKS_CREATE_FAILURE:
      return {
        ...state,
        addTaskLoading: state.addTaskLoading.filter((actionId) => (actionId !== action.actionId))
      }
    case actions.API_TASKS_CREATE_SUCCESS:
      return {
        ...state,
        workday: {...state.workday, task_set: [...state.workday.task_set, action.data.data]},
        addTaskLoading: state.addTaskLoading.filter((actionId) => (actionId !== action.actionId))
      }

    case actions.API_TASKS_UPDATE_REQUEST:
      return {...state, updateTaskLoading: [...state.updateTaskLoading, action.actionId]}
    case actions.API_TASKS_UPDATE_FAILURE:
      return {
        ...state,
        updateTaskLoading: state.updateTaskLoading.filter((actionId) => (actionId !== action.actionId))
      }
    case actions.API_TASKS_UPDATE_SUCCESS:
      return {
        ...state,
        workday: {
          ...state.workday,
          task_set: state.workday.task_set.map((task) => (
            task.id === action.data.data.id
              ? action.data.data
              : task
          ))
        },
        updateTaskLoading: state.updateTaskLoading.filter((actionId) => (actionId !== action.actionId))
      }

    default:
      return state
  }
}

export default currentWorkday
