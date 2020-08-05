import React, { Component } from "react";
import './App.css';
import SyncModalComponent from './components/syncModalComponent';
import TableExp from './components/tableExampleComponent';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import AggregateComponent from './components/aggregateComponent'


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    }

    
  };

  updateState = (values)=>{
    this.setState({ data: values});
  }

  render() {
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
            <AggregateComponent teste={this.state.data}/>
          </Grid>
          <Grid item xs={10} spacing={1} className='testeTable'>
            <TableExp teste={this.updateState}/>
          </Grid>

        </Grid>



      </Grid>
    </Container>)
  };
}

