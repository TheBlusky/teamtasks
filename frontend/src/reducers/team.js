import * as actions from '../redux/actions'

const team = (state = {addUser: {loading: false, success: false}}, action) => {
  switch (action.type) {
    case actions.API_TEAMS_ADDUSER_REQUEST:
      return {...state, addUser: {loading: true, success: false}}
    case actions.API_TEAMS_ADDUSER_SUCCESS:
      return {...state, addUser: {loading: false, success: true}}
    case actions.API_TEAMS_ADDUSER_FAILURE:
      return {...state, addUser: {loading: false, success: false}}
    default:
      return state
  }
}

export default team
