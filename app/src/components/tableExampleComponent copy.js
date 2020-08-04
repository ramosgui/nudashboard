import React, { Component } from "react";
import axios from 'axios'

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import ReactTooltip from "react-tooltip";
import LabelOffIcon from '@material-ui/icons/LabelOff';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import LabelIcon from '@material-ui/icons/Label';

class GenericTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

  }

  componentWillMount() {
    //console.log('CPF: ' + this.state.cpf, ' Password: ' + this.state.password + ' UUID: ' + this.state.uuid)
    axios.get('http://localhost:5050/transactions', {}).then(res => {
      const result = res.data;
      this.setState({ data: result });
    });
  }

  render() {
    const classes = makeStyles({
      root: {
        width: '100%',
      },
      container: {
        maxHeight: 440,
      },
    });

    return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Title</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
              <TableCell><b>Date</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.data.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell>
                  <div data-tip='hello world' data-tip={"Raw Title: " + row.rawTitle + "<br>Title by Map: " + row.titleByMap + "<br>Title by ID: " + row.titleById} data-for={row.id}>
                    {row.titleById ? row.titleById : row.titleByMap ? row.titleByMap : row.rawTitle} {row.charges ? "("+row.chargesPaid+"/"+row.charges+")" : undefined}

                    {row.titleById ? <LabelImportantIcon style={{ fontSize: 14 }} /> : row.titleByMap ? <LabelIcon style={{ fontSize: 14 }} /> : <LabelOffIcon style={{ fontSize: 14 }} />}
                  </div>
                  <ReactTooltip id={row.id} html={true} />
                </TableCell>
                <TableCell>
                  <div data-tip='hello world' data-tip={"Raw Category: " + row.rawCategory + "<br>Category by Map: " + row.categoryByMap + "<br>Category by ID: " + row.categoryById} data-for={row.id}>
                    {row.categoryById ? row.categoryById : row.categoryByMap ? row.categoryByMap : row.rawCategory}
                    {row.categoryById ? <LabelImportantIcon style={{ fontSize: 14 }} /> : row.categoryByMap ? <LabelIcon style={{ fontSize: 14 }} /> : <LabelOffIcon style={{ fontSize: 14 }} />}
                  </div>
                  <ReactTooltip id={row.id} html={true} />
                </TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.dt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </TableContainer>
      </Paper>
    );
  }
}

export default GenericTable;
