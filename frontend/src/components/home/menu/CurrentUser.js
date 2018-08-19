import React, { Component } from 'react'
import { Classes, Menu as BPMenu, MenuDivider, MenuItem } from '@blueprintjs/core'
import * as actions from '../../../redux/actions'
import { connect } from 'react-redux'
import * as pages from '../../../reducers/displayedPage'

class CurrentUser extends Component {
  render () {
    return (
      <BPMenu className={Classes.ELEVATION_1}>
        <MenuDivider title={this.props.currentUser.user.username} />
        <MenuItem icon='predictive-analysis' text='Fortune' onClick={() => this.props.loadPage(pages.PAGE_DEFAULT)} />
      </BPMenu>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.teamtasksStore.currentUser
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadPage: (page) => {
      dispatch({
        type: actions.PAGE_CHANGE,
        data: {page}
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentUser)
