import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Cell } from 'styled-css-grid'
import { Button, Card, Elevation, H5, EditableText, Spinner, Tooltip, Position } from '@blueprintjs/core'
import * as actions from '../../../redux/actions'
import { fortuneComments, fortuneTasks } from '../../../fortune'

class Planning extends Component {
  state = {
    newTaskLabel: '',
    newTaskComment: '',
    newTaskActionId: false,
    updateActionsId: [],
    tasks: [],
    fortune: this.newFortune()
  }

  newFortune () {
    return {
      comment: fortuneComments[Math.floor(Math.random() * fortuneComments.length)],
      task: fortuneTasks[Math.floor(Math.random() * fortuneTasks.length)]
    }
  }

  addTask = () => {
    const newTaskActionId = actions.generateActionId()
    this.setState({newTaskActionId})
    this.props.addTask(this.state, newTaskActionId)
  }

  updateTask = (position) => {
    const stateTask = this.state.tasks[position]
    const propsTask = this.props.currentWorkday.workday.task_set[position]
    if (propsTask.id !== stateTask.id) {
      global.alert('Something went wrong !')
      return
    }
    if (JSON.stringify(propsTask) === JSON.stringify(stateTask)) {
      // Nothing changed
      return
    }
    const actionId = actions.generateActionId()
    this.setState({updateActionsId: [
      ...this.state.updateActionsId,
      {actionId, taskId: stateTask.id}
    ]})
    this.props.updateTask(stateTask, actionId)
  }

  handleChange = (type, index, value) => {
    this.setState({
      tasks: this.state.tasks.map((task, i) => {
        if (i !== index) return task
        if (type === 'label') return {...task, label: value}
        if (type === 'comments_planning') return {...task, comments_planning: value}
        return task
      })
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    let shouldComponentUpdate = true
    if (this.props.currentWorkday.workday.task_set.length !== nextProps.currentWorkday.workday.task_set.length) {
      this.setState({tasks: nextProps.currentWorkday.workday.task_set})
      shouldComponentUpdate = false
    }
    if (this.state.newTaskActionId && !(this.state.newTaskActionId in nextProps.currentWorkday.addTaskLoading)) {
      this.setState({
        newTaskLabel: '',
        newTaskComment: '',
        newTaskActionId: false,
        fortune: this.newFortune()
      })
      shouldComponentUpdate = false
    }
    const updateActionsId = this.state.updateActionsId.filter(({actionId}) => (
      nextProps.currentWorkday.updateTaskLoading.indexOf(actionId) > -1
    ))
    if (updateActionsId.length !== this.state.updateActionsId.length) {
      this.setState({updateActionsId})
      shouldComponentUpdate = false
    }
    return shouldComponentUpdate
  }

  componentDidMount () {
    this.setState({tasks: this.props.currentWorkday.workday.task_set})
  }

  render () {
    return (
      <Card elevation={Elevation.ONE}>
        <div>
          <Grid columns={'1fr 2fr 30px'}>
            <Cell><H5>Task label</H5></Cell>
            <Cell><H5>Pre-planning comments</H5></Cell>
            <Cell />

            {this.state.tasks.map((task, i) => ([
              <Cell key={`${task.id}-label`}>
                <EditableText
                  multiline minLines={1} maxLines={1}
                  disabled={
                    this.state.updateActionsId.filter(({taskId}) => (this.state.tasks[i].id === taskId)).length > 0
                  }
                  onConfirm={() => this.updateTask(i)}
                  value={this.state.tasks[i].label}
                  onChange={(label) => this.handleChange('label', i, label)} />
              </Cell>,
              <Cell key={`${task.id}-comment`}>
                <EditableText
                  multiline minLines={1} maxLines={1}
                  disabled={
                    this.state.updateActionsId.filter(({taskId}) => (this.state.tasks[i].id === taskId)).length > 0
                  }
                  onConfirm={() => this.updateTask(i)}
                  value={this.state.tasks[i].comments_planning}
                  onChange={(commentsPlanning) => this.handleChange('comments_planning', i, commentsPlanning)} />
              </Cell>,
              <Cell key={`${task.id}-remove`}>
                { this.state.updateActionsId.filter(({taskId}) => (this.state.tasks[i].id === taskId)).length > 0
                  ? <Spinner size={22} />
                  : <Button className='bp3-small' icon='trash' />
                }
              </Cell>
            ]))}

            <Cell>
              <EditableText
                multiline minLines={1} maxLines={1}
                placeholder={this.state.fortune.task}
                value={this.state.newTaskLabel}
                disabled={this.state.newTaskActionId}
                onChange={(newTaskLabel) => this.setState({newTaskLabel})} />
            </Cell>
            <Cell>
              <EditableText
                multiline minLines={1} maxLines={1}
                disabled={this.state.newTaskActionId}
                placeholder={this.state.fortune.comment}
                value={this.state.newTaskComment}
                onChange={(newTaskComment) => this.setState({newTaskComment})} />
            </Cell>
            <Cell>
              {this.state.newTaskActionId
                ? <Spinner size={22} />
                : <Button
                  className='bp3-small'
                  icon='add'
                  disabled={this.state.newTaskLabel === '' || this.state.newTaskComment === ''}
                  onClick={this.addTask} />
              }
            </Cell>
          </Grid>
          <div style={{'textAlign': 'center'}}>
            { (this.state.newTaskLabel !== '' ||
              this.state.newTaskComment !== '' ||
              this.state.updateActionsId.length > 0 ||
              this.state.newTaskActionId)
              ? <Tooltip content='You have an unsaved task pending' position={Position.TOP}>
                <Button disabled>Validate planning</Button>
              </Tooltip>
              : <Button onClick={this.props.validatePlanning}>Validate planning</Button>
            }
          </div>
        </div>
      </Card>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentWorkday: state.teamtasksStore.currentWorkday
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addTask: ({newTaskLabel, newTaskComment}, actionId) => {
      dispatch({
        type: actions.API_TASKS_CREATE_REQUEST,
        data: {label: newTaskLabel, comments_planning: newTaskComment},
        actionId
      })
    },
    updateTask: (taskData, actionId) => {
      dispatch({
        type: actions.API_TASKS_UPDATE_REQUEST,
        data: taskData,
        actionId
      })
    },
    validatePlanning: () => {
      dispatch({type: actions.API_WORKDAYS_VALIDATEPLANNING_REQUEST})
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Planning)
