import * as actions from '../redux/actions'

const ping = (state = {users: [], loading_get: false, loading_ping: false}, action) => {
  switch (action.type) {
    case actions.API_GAMIFICATION_GETPING_RESET:
      return {users: [], loading_get: false, loading_ping: false}
    case actions.API_GAMIFICATION_GETPING_REQUEST:
      return {users: [], loading_get: true, loading_ping: false}
    case actions.API_GAMIFICATION_GETPING_SUCCESS:
      return {users: action.data.users.map((u) => u.username), loading_get: false, loading_ping: false}
    case actions.API_GAMIFICATION_GETPING_FAILURE:
      return {users: [], loading_get: false, loading_ping: false}
    case action.API_GAMIFICATION_SENDPING_SUCCESS:
    case action.API_GAMIFICATION_SENDPING_FAILURE:
      return {...state, loading_ping: false}
    case action.API_GAMIFICATION_SENDPING_REQUEST:
      return {...state, loading_ping: true}
    default:
      return state
  }
}

export default ping
