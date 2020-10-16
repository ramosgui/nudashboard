import React, { useState, useEffect } from "react";
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    minHeight: 230
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard(props) {
  const classes = useStyles();
  /* const bull = <span className={classes.bullet}>•</span>; */


  const [forecast, setForecast] = useState({
    'positive': 0,
    'negative': 0
  });

  useEffect(() => {
    var host = window.location.hostname;
    var today = new Date();

    axios.get('http://' + host + ':5050/transactions/fixed/amount', {'params': {'startDate': new Date(today.getFullYear(), today.getMonth(), 1), 'endDate': today}}).then(res => {
      setForecast(res.data)
    });

  }, [props.updateData])

  const getTotalValue = (positive, negative) => {
    return roundToTwo(positive + negative)
  }

  function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Planejamento do mês atual
        </Typography>
        <Typography variant="body2" component="p">

          <List dense={true}>

            <ListItem>
              <ListItemText style={{width: '80px'}} primary='Renda' />
              <ListItemSecondaryAction><ListItemText primary={'R$ ' + forecast.positive} /></ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText style={{width: '80px'}} primary='Gastos fixos' />
              <ListItemSecondaryAction><ListItemText primary={'R$ ' + forecast.negative} /></ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText style={{width: '80px'}} primary='Gastos planejados' />
              <ListItemSecondaryAction><ListItemText primary='Em breve' /></ListItemSecondaryAction>
            </ListItem>

            <Divider/>
            <ListItem>
              <ListItemText style={{width: '80px'}} primary='Total' />
              <ListItemSecondaryAction><ListItemText primary={'R$ ' + getTotalValue(forecast.positive, forecast.negative)} /></ListItemSecondaryAction>
            </ListItem>


          </List>



        </Typography>
      </CardContent>
    </Card>
  );
}
