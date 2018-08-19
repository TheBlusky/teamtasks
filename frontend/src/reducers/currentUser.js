import * as actions from '../redux/actions'

const currentUser = (state = {level: undefined, user: {}, loading: false, canRegister: false}, action) => {
  switch (action.type) {
    case actions.API_USERS_STATUS_REQUEST:
      return {...state, loading: true}
    case actions.API_USERS_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        level: action.data.level,
        canRegister: action.data.can_register,
        user: {
          username: action.data.username,
          team_name: action.data.team_name
        }
      }
    case actions.API_USERS_STATUS_FAILURE:
      return {level: undefined, user: {}, loading: false}
    case actions.API_USERS_REGISTER_REQUEST:
      return {...state, loading: true}
    case actions.API_USERS_REGISTER_SUCCESS:
      return {...state, loading: true}
    case actions.API_USERS_REGISTER_FAILURE:
      return {...state, loading: false}
    case actions.API_USERS_LOGIN_REQUEST:
      return {...state, loading: true}
    case actions.API_USERS_LOGIN_SUCCESS:
      return {...state, loading: true}
    case actions.API_USERS_LOGIN_FAILURE:
      return {...state, loading: false}
    case actions.API_USERS_LOGOUT_REQUEST:
      return {...state, loading: true, level: undefined, user: {}}
    case actions.API_USERS_LOGOUT_SUCCESS:
      return {...state, loading: true, level: undefined, user: {}}
    case actions.API_USERS_LOGOUT_FAILURE:
      return {...state, loading: false, level: undefined, user: {}}
    case actions.API_TEAMS_CREATE_REQUEST:
      return {...state, loading: true}
    case actions.API_TEAMS_CREATE_SUCCESS:
      return {...state, loading: true}
    case actions.API_TEAMS_CREATE_FAILURE:
      return {...state, loading: false}
    default:
      return state
  }
}

export default currentUser
