import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Toaster, Intent } from '@blueprintjs/core'
import * as actions from '../../redux/actions'

const jsonErrorToString = (json) => {
  return Object
    .keys(json)
    .map((k) => {
      return `${k}: ${json[k]}`
    })
    .join('\n')
}

class ErrorHandler extends Component {
  state = {
    displayedErrorId: []
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.errors.length !== nextProps.errors.length) {
      const displayedErrorId = nextProps.errors.map((error) => {
        if (!(error.id in this.state.displayedErrorId)) {
          this.refs.toaster.show({
            intent: Intent.DANGER,
            message: error.error
          })
          this.props.flushError(error.id)
        }
        return error.id
      })
      this.setState({displayedErrorId})
    }
    return true
  }

  render () {
    return <Toaster ref='toaster' />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.teamtasksStore.errors.errors
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    flushError: (flushedId) => {
      dispatch({
        type: actions.ERROR_FLUSH,
        data: {flushedId}
      })
    }
  }
}

export {jsonErrorToString}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorHandler)
