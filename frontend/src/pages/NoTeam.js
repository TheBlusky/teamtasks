import React, { Component } from 'react'
import { Grid, Cell } from 'styled-css-grid'
import { Card, Elevation, Tabs, Tab } from '@blueprintjs/core'
import Create from '../components/noteam/Create'
import Join from '../components/noteam/Join'

class NoTeamPage extends Component {
  render () {
    return (
      <Grid columns={'auto minmax(300px,400px) auto'}>
        <Cell style={{'paddingTop': 10}} width={1} left={2}>
          <div style={{'paddingTop': 10}}>
            <Card elevation={Elevation.TWO}>
              <h5><a>Teamtasks</a></h5>
              Your account does not belong to a team yet.
              You can either ask an admin to join a team or create your own.
            </Card>
          </div>
          <div style={{'paddingTop': 10}}>
            <Card elevation={Elevation.TWO}>
              <Tabs>
                <Tab id='tab_join' title='Join a team' panel={<Join />} />
                <Tab id='tab_create' title='Create a team' panel={<Create />} />
              </Tabs>
            </Card>
          </div>
        </Cell>
      </Grid>
    )
  }
}

export default NoTeamPage
