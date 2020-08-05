import React, { Component } from "react";
import axios from 'axios'

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class AggregateComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

  }

  componentWillMount() {
    axios.get('http://localhost:5050/transactions/category/amount', {}).then(res => {
      const result = res.data;
      this.setState({ data: result });
    });
  }

  render() {
    const classes = makeStyles({
      table: {
        minWidth: 350,
      }
    });

    return (<>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead className='teste'>
            <TableRow>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.data.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </TableContainer>


    </>
    );
  }
}

export default AggregateComponent;
