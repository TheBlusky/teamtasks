import React, { Component } from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'
import RootPage from './pages/Root'

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <RootPage />
      </Provider>
    )
  }
}

export default App
