import React, { Component } from 'react'
import { Classes, Menu as BPMenu, MenuDivider, MenuItem, Spinner } from '@blueprintjs/core'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actions'
import * as pages from '../../../reducers/displayedPage'
import moment from 'moment'

class Views extends Component {
  render () {
    return (
      <div>
        <BPMenu className={Classes.ELEVATION_1}>
          <MenuDivider title='Views' />
          <MenuItem
            icon='timeline-events'
            text='Today'
            onClick={() => { this.props.loadPage(pages.VIEW_DAILY, {days: moment().format('YYYY-MM-DD')}) }} />
          <MenuItem icon='new-grid-item' text='Week views'>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((delta) => {
              const day = moment().add(delta * -1, 'day')
              return <MenuItem
                key={delta}
                icon='timeline-events'
                text={day.format(`${delta === 0 ? '[Today]' : (delta === 1 ? '[Yesterday]' : 'dddd')} MMM Do`)}
                onClick={() => { this.props.loadPage(pages.VIEW_DAILY, {days: day.format('YYYY-MM-DD')}) }} />
            })}
          </MenuItem>
          <MenuItem icon='flows' text='Flow view' onClick={() => { this.props.loadPage(pages.VIEW_FLOW) }} />
          <MenuItem
            icon='people'
            text='Per-user view'
            label={this.props.users.loading ? <Spinner size={15} /> : undefined}>
            {
              this.props.users.users.map((user) => (
                <MenuItem
                  key={user.django_user.username}
                  icon='person'
                  text={user.django_user.username}
                  onClick={() => { this.props.loadPage(pages.VIEW_USER, {user: user.id}) }} />
              ))
            }
          </MenuItem>
        </BPMenu>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.teamtasksStore.users
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadPage: (page, data = {}) => {
      dispatch({
        type: actions.PAGE_CHANGE,
        data: {page, data}
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Views)
