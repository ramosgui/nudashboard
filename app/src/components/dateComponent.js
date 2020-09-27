import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import axios from 'axios'
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

export default function MaterialUIPickers(props) {
  // The first commit of Material-UI
  

  const handleStartDateChange = (date) => {
    props.setStartDate(date);
    console.log(date)
  };

  const handleEndDateChange = (date) => {
    props.setEndDate(date);
    console.log(date)
  };

  const submitFunction = (event) => {
    var host = window.location.hostname;
    axios.get('http://'+host+':5050/transactions', { 'params': { 'startDate': props.startDate, 'endDate': props.endDate } }).then(res => {
      props.setTableData(res.data)
    });
  }

  return (<>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container>
        <DatePicker
          autoOk
          disableFuture
          margin="normal"
          id="start-date"
          label="Data Inicial"
          format="dd/MM/yyyy"
          value={props.startDate}
          onChange={handleStartDateChange}
          animateYearScrolling
        />
        <DatePicker
        autoOk
        disableFuture
          margin="normal"
          id="end-date"
          label="Data Final"
          format="dd/MM/yyyy"
          value={props.endDate}
          onChange={handleEndDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <Button onClick={submitFunction} variant="outlined" style={{width: '10px', height: '30px', marginTop: '20px'}} color="primary">
    SUBMIT
  </Button>
      </Grid>
    </MuiPickersUtilsProvider>
    </>
  );
}
