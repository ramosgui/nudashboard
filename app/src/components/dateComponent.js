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
  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date('2020-09-01T03:00:00'));
  const [selectedEndDate, setSelectedEndDate] = React.useState(new Date());

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    console.log(date)
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
    console.log(date)
  };

  const submitFunction = (event) => {
    var host = window.location.hostname;
    axios.get('http://'+host+':5050/transactions', { 'params': { 'startDate': selectedStartDate, 'endDate': selectedEndDate } }).then(res => {
      props.setTableData(res.data)
      event.preventDefault();
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
          format="MM/dd/yyyy"
          value={selectedStartDate}
          onChange={handleStartDateChange}
          animateYearScrolling
        />
        <DatePicker
        autoOk
        disableFuture
          margin="normal"
          id="end-date"
          label="Data Final"
          format="MM/dd/yyyy"
          value={selectedEndDate}
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
