import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Cell } from 'styled-css-grid'
import { Button, Card, Elevation, H5, EditableText, Spinner, Tooltip, Position, Classes, Checkbox, AnchorButton } from '@blueprintjs/core'
import * as actions from '../../../redux/actions'
import { fortuneComments, fortuneTasks } from '../../../fortune'

class Working extends Component {
  state = {
    newTaskLabel: '',
    newTaskComment: '',
    newTaskDone: false,
    newTaskProgress: -1,
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

  updateTask = (position, forcedValues = false) => {
    const stateTask = this.state.tasks[position]
    const propsTask = this.props.currentWorkday.workday.task_set[position]
    if (propsTask.id !== stateTask.id) {
      global.alert('Something went wrong !')
      return
    }
    if (!forcedValues && JSON.stringify(propsTask) === JSON.stringify(stateTask)) {
      // Nothing changed
      return
    }
    const actionId = actions.generateActionId()
    this.setState({updateActionsId: [
      ...this.state.updateActionsId,
      {actionId, taskId: stateTask.id}
    ]})
    this.props.updateTask({...stateTask, ...forcedValues}, actionId)
  }

  handleChange = (type, index, value) => {
    this.setState({
      tasks: this.state.tasks.map((task, i) => {
        if (i !== index) return task
        if (type === 'label') return {...task, label: value.substring(0, 64).replace('\n', '')}
        if (type === 'comments_validation') return {...task, comments_validation: value.replace('\n', '')}
        if (type === 'done') return {...task, done: value}
        return task
      })
    })
    if (type === 'done') this.updateTask(index, {done: value})
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
        newTaskDone: false,
        newTaskProgress: -1,
        newTaskActionId: false,
        fortune: this.newFortune()
      })
      shouldComponentUpdate = false
    }
    const updateActionsId = nextState.updateActionsId.filter(({actionId}) => (
      nextProps.currentWorkday.updateTaskLoading.indexOf(actionId) > -1
    ))
    if (JSON.stringify(updateActionsId) !== JSON.stringify(nextState.updateActionsId)) {
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
          <Grid columns={'1fr 2fr 50px 50px'}>
            <Cell><H5>Task label</H5></Cell>
            <Cell><H5>Post-planning comments</H5></Cell>
            <Cell><H5>Done</H5></Cell>
            <Cell />

            {this.state.tasks.map((task, i) => ([
              <Cell key={`${task.id}-label`}>
                { this.state.tasks[i].planned
                  ? <div>
                    <Tooltip
                      className={Classes.TOOLTIP_INDICATOR}
                      content={this.state.tasks[i].comments_planning}
                      position={Position.RIGHT}>
                      <Button className='bp3-small' icon='tag' />
                    </Tooltip>
                    &nbsp;
                    {this.state.tasks[i].label}
                  </div>
                  : <EditableText
                    multiline minLines={1} maxLines={3}
                    disabled={
                      this.state.updateActionsId.filter(({taskId}) => (this.state.tasks[i].id === taskId)).length > 0
                    }
                    onConfirm={() => this.updateTask(i)}
                    value={this.state.tasks[i].label}
                    onChange={(label) => this.handleChange('label', i, label)} />
                }
              </Cell>,
              <Cell key={`${task.id}-comment`}>
                <EditableText
                  multiline minLines={1} maxLines={3}
                  disabled={
                    this.state.updateActionsId.filter(({taskId}) => (this.state.tasks[i].id === taskId)).length > 0
                  }
                  onConfirm={() => this.updateTask(i)}
                  value={this.state.tasks[i].comments_validation}
                  onChange={(commentsValidation) => this.handleChange('comments_validation', i, commentsValidation)} />
              </Cell>,
              <Cell key={`${task.id}-done`}>
                <Checkbox
                  disabled={
                    this.state.updateActionsId.filter(({taskId}) => (this.state.tasks[i].id === taskId)).length > 0
                  }
                  checked={this.state.tasks[i].done}
                  onChange={() => this.handleChange('done', i, !this.state.tasks[i].done)} />
              </Cell>,
              <Cell key={`${task.id}-remove`}>
                { this.state.updateActionsId.filter(({taskId}) => (this.state.tasks[i].id === taskId)).length > 0
                  ? <Spinner size={22} />
                  : this.state.tasks[i].planned
                    ? <Tooltip
                      className={Classes.TOOLTIP_INDICATOR}
                      content={'Tasks created in planning cannot be removed'}
                      position={Position.LEFT}>
                      <AnchorButton className='bp3-small' disabled icon='trash' />
                    </Tooltip>
                    : <Button className='bp3-small' icon='trash' />
                }
              </Cell>
            ]))}

            <Cell>
              <EditableText
                multiline minLines={1} maxLines={3}
                value={this.state.newTaskLabel}
                placeholder={this.state.fortune.task}
                disabled={this.state.newTaskActionId}
                onChange={(newTaskLabel) => this.setState({
                  newTaskLabel: newTaskLabel.substring(0, 64).replace('\n', '')
                })} />
            </Cell>
            <Cell>
              <EditableText
                multiline minLines={1} maxLines={3}
                disabled={this.state.newTaskActionId}
                placeholder={this.state.fortune.comment}
                value={this.state.newTaskComment}
                onChange={(newTaskComment) => this.setState({
                  newTaskComment: newTaskComment.replace('\n', '')}
                )} />
            </Cell>
            <Cell>
              <Checkbox
                checked={this.state.newTaskDone}
                onChange={() => this.setState({newTaskDone: !this.state.newTaskDone})} />
            </Cell>
            <Cell>
              {this.state.newTaskActionId
                ? <Spinner size={22} />
                : <Button
                  className='bp3-small'
                  icon='add'
                  disabled={this.state.newTaskLabel === ''}
                  onClick={this.addTask} />
              }
            </Cell>
          </Grid>
          <div style={{'textAlign': 'center'}}>
            { (this.state.newTaskLabel !== '' ||
              this.state.newTaskComment !== '' ||
              this.state.updateActionsId.length > 0 ||
              this.state.newTaskDone ||
              this.state.newTaskActionId)
              ? <Tooltip content='You have an unsaved task pending' position={Position.TOP}>
                <AnchorButton disabled>Finish Workday</AnchorButton>
              </Tooltip>
              : <Button onClick={this.props.validateWorking}>Finish Workday</Button>
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
    addTask: ({newTaskLabel, newTaskComment, newTaskDone, newTaskProgress}, actionId) => {
      dispatch({
        type: actions.API_TASKS_CREATE_REQUEST,
        data: {
          label: newTaskLabel,
          comments_validation: newTaskComment,
          done: newTaskDone,
          progress: newTaskProgress
        },
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
    validateWorking: () => {
      dispatch({type: actions.API_WORKDAYS_VALIDATEWORKING_REQUEST})
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Working)
