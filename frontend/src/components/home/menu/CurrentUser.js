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
        <MenuItem icon='predictive-analysis' text='Home' onClick={() => this.props.loadPage(pages.PAGE_DEFAULT)} />
        {/*
        <MenuItem icon='link' text='Level' label='1' />
        <MenuItem icon='heart' text='HP' label='18/20' />
        <MenuItem icon='build' text='XP' label='120/200' />
        <MenuItem icon='timeline-bar-chart' text='Leaderboard' />
        */}
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
