import React, { Component } from 'react'
import { Classes, Menu as BPMenu, MenuDivider, MenuItem, MultiSlider, Tag, Intent, Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actions'

class Gamification extends Component {
  markAsRead = () => {
    if (this.props.gamification.notifications.length === 0) return
    const lastSeen = this.props.gamification.notifications[0].created_at
    this.props.markAsRead(lastSeen)
  }

  componentDidMount () {
    this.props.loadUserLevel()
  }

  render () {
    const userLevel = this.props.gamification.userLevel
    const notifications = this.props.gamification.notifications
    const nbUnread = notifications.filter((n) => (!n.read)).length
    return (
      <BPMenu className={Classes.ELEVATION_1}>
        <MenuDivider title={<div>
          <span style={{float: 'left'}}>
            TeamTasks RPG
          </span>
          <span style={{float: 'right'}}>
            { notifications.length > 0 && <Popover
              position={Position.RIGHT_TOP}
              interactionKind={PopoverInteractionKind.HOVER.toString()} >
              <span style={{float: 'right'}}>
                { nbUnread > 0
                  ? <Tag interactive round intent={Intent.DANGER} onClick={this.markAsRead}>+{nbUnread}</Tag>
                  : <Tag interactive round onClick={this.markAsRead}>...</Tag>
                }
              </span>
              <div style={{marginRight: '20px'}}>
                &nbsp;
                <ul>
                  {notifications.map((notification) => {
                    return <li key={notification.created_at} style={notification.read ? {} : {fontWeight: 'bold'}}>
                      {notification.amount} {notification.field} - {notification.message} (2 days ago)
                    </li>
                  })}
                </ul>
                &nbsp;
              </div>
            </Popover> }
          </span>
        </div>} />
        <MenuItem icon='link' text='Level' label={userLevel ? userLevel.level : '...'} />
        <MenuItem icon='heart' text='HP' label={
          <MultiSlider
            disabled
            min={0}
            max={userLevel ? userLevel.hp_max : 1}
            labelStepSize={userLevel ? userLevel.hp_max : 1}>
            <MultiSlider.Handle
              value={userLevel ? userLevel.hp : 0}
              intentBefore={'danger'} />
          </MultiSlider>
        } />
        <MenuItem icon='build' text='XP' label={
          <MultiSlider
            disabled
            min={0}
            max={userLevel ? userLevel.xp_required : 1}
            labelStepSize={userLevel ? userLevel.xp_required : 1}>
            <MultiSlider.Handle
              value={userLevel ? userLevel.xp : 0}
              intentBefore={'warning'} />
          </MultiSlider>
        } />
      </BPMenu>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    gamification: state.teamtasksStore.gamification
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadUserLevel: () => {
      dispatch({
        type: actions.GAMIFICATION_REQUEST
      })
    },
    markAsRead: (lastSeen) => {
      dispatch({
        type: actions.GAMIFICATION_REQUEST,
        data: {last_seen: lastSeen}
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gamification)
