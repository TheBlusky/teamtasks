import reducers from '../reducers/index'
import sagas from '../sagas/index'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  combineReducers({teamtasksStore: reducers}),
  applyMiddleware(
    sagaMiddleware
  )
)
sagaMiddleware.run(sagas)

export default store
