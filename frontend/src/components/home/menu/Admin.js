import React, { Component } from 'react'
import { Classes, Menu as BPMenu, MenuDivider, MenuItem } from '@blueprintjs/core'
import AddUser from '../admin/AddUser'
import { connect } from 'react-redux'

class Admin extends Component {
  state = {
    addUserDialogOpen: false
  }

  render () {
    if (this.props.currentUser.level === 'Admin') {
      return (
        <div>
          <BPMenu className={Classes.ELEVATION_1}>
            <MenuDivider title='Admin' />
            <MenuItem icon='new-person' text='Add user' onClick={() => this.setState({addUserDialogOpen: true})} />
          </BPMenu>
          <AddUser isOpen={this.state.addUserDialogOpen} close={() => this.setState({addUserDialogOpen: false})} />
        </div>
      )
    } else {
      return false
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.teamtasksStore.currentUser
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin)
