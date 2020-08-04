import React from 'react';
import './App.css';
import SyncModalComponent from './components/syncModalComponent';
import TableExp from './components/tableExampleComponent';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import AggregateComponent from './components/aggregateComponent'

function App() {

  return (
    <Container maxWidth='100%' className='custom_container'>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={12} spacing={1}>
          <SyncModalComponent />
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={2} spacing={1}>
            <AggregateComponent/>
          </Grid>
          <Grid item xs={10} spacing={1} className='testeTable'>
            <TableExp/>
          </Grid>
          
        </Grid>



      </Grid>
    </Container>
  );
}

export default App;
