import * as actions from '../redux/actions'

const gamification = (state = {userLevel: undefined, notifications: [], loading: false}, action) => {
  switch (action.type) {
    case actions.GAMIFICATION_REQUEST:
      return {...state, loading: true}
    case actions.GAMIFICATION_FAILURE:
      return {...state, loading: false}
    case actions.GAMIFICATION_SUCCESS:
      return {
        loading: false,
        userLevel: action.data.user_level,
        notifications: action.data.notifications
      }
    default:
      return state
  }
}

export default gamification
