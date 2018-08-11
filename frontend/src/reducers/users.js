import * as actions from '../redux/actions'

const users = (state = {users: [], loading: false}, action) => {
  switch (action.type) {
    case actions.API_USERS_LIST_REQUEST:
      return {...state, loading: true}
    case actions.API_USERS_LIST_SUCCESS:
      return {...state, loading: false, users: action.data.data}
    case actions.API_USERS_LIST_FAILURE:
      return {...state, loading: false}
    default:
      return state
  }
}

export default users
