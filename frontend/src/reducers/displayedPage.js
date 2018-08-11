import {
  PAGE_CHANGE
} from '../redux/actions'

export const PAGE_DEFAULT = 0
export const EDIT_WORKDAY = 1
export const VIEW_FLOW = 2
export const VIEW_USER = 3
export const VIEW_DAILY = 4

const displayedPage = (state = {page: PAGE_DEFAULT, data: {}}, action) => {
  switch (action.type) {
    case PAGE_CHANGE:
      const data = action.data.data ? action.data.data : {}
      return {page: action.data.page, data}
    default:
      return state
  }
}

export default displayedPage
