import React, { Component } from 'react'
import { Grid, Cell } from 'styled-css-grid'
import { Spinner, Card, Elevation } from '@blueprintjs/core'

class LoadingPage extends Component {
  render () {
    return (
      <Grid columns={'auto minmax(300px,400px) auto'}>
        <Cell style={{'paddingTop': 10}} width={1} left={2}>
          <div style={{'paddingTop': 10}}>
            <Card elevation={Elevation.TWO} style={{'textAlign': 'center'}}>
              <Spinner size={100} />
            </Card>
          </div>
        </Cell>
      </Grid>
    )
  }
}

export default LoadingPage
