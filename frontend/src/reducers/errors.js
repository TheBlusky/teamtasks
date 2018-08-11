import {
  ERROR_ADD, ERROR_FLUSH
} from '../redux/actions'

const errors = (state = {errors: [], nextId: 0}, action) => {
  switch (action.type) {
    case ERROR_ADD:
      return {
        errors: [...state.errors, {error: action.data.error, id: state.nextId}],
        nextId: state.nextId + 1
      }
    case ERROR_FLUSH:
      return {
        errors: state.errors.filter((error) => error.id !== action.data.flushedId),
        nextId: state.nextId
      }
    default:
      return state
  }
}

export default errors
