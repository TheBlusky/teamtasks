import {combineReducers} from 'redux'
import currentUser from './currentUser'
import errors from './errors'
import team from './team'
import users from './users'
import currentWorkday from './currentWorkday'
import displayedPage from './displayedPage'
import workdays from './workdays'

const reducers = combineReducers({
  currentUser,
  currentWorkday,
  team,
  users,
  workdays,
  displayedPage,
  errors
})

export default reducers
