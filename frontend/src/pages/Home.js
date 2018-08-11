import React, { Component } from 'react'
import { Grid, Cell } from 'styled-css-grid'
import Menu from '../components/home/menu'
import * as actions from '../redux/actions'
import * as pages from '../reducers/displayedPage'
import { connect } from 'react-redux'
import CurrentWorkdayEdit from '../components/home/currentworkday'
import Flow from '../components/home/views/Flow'
import Home from '../components/home/Home'
import Daily from '../components/home/views/Daily'

class HomePage extends Component {
  componentDidMount () {
    this.props.requestsUsersList()
    this.props.requestsWorkdaysCurrent()
  }

  render () {
    return (
      <Grid columns={'300px minmax(400px, 1fr)'}>
        <Cell style={{'padding': '10px'}}><Menu /></Cell>
        <Cell style={{'padding': '10px'}}>
          {this.props.displayedPage === pages.PAGE_DEFAULT && <Home />}
          {this.props.displayedPage === pages.EDIT_WORKDAY && <CurrentWorkdayEdit />}
          {this.props.displayedPage === pages.VIEW_FLOW && <Flow />}
          {this.props.displayedPage === pages.VIEW_USER && <Flow filters={this.props.pageData} />}
          {this.props.displayedPage === pages.VIEW_DAILY && <Daily filters={this.props.pageData} />}
        </Cell>
      </Grid>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    displayedPage: state.teamtasksStore.displayedPage.page,
    pageData: state.teamtasksStore.displayedPage.data
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    requestsUsersList: () => { dispatch({type: actions.API_USERS_LIST_REQUEST}) },
    requestsWorkdaysCurrent: () => { dispatch({type: actions.API_WORKDAYS_CURRENT_REQUEST}) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
