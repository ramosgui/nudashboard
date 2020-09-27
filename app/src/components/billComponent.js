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

const useStyles = makeStyles({
  root: {
    minWidth: 275,
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

  const [data, setData] = useState({});

  const [forecast, setForecast] = useState({});

  useEffect(() => {
    var host = window.location.hostname;
    var today = new Date();

    axios.get('http://' + host + ':5050/transactions/transfer_in', {}).then(res => {
      setData(res.data)
    });

    axios.get('http://' + host + ':5050/transactions/fixed/amount', {'params': {'startDate': new Date(today.getFullYear(), today.getMonth(), 1), 'endDate': today}}).then(res => {
      setForecast(res.data)
    });

  }, [props.updateData])

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Overview do Mês
        </Typography>
        <Typography variant="body2" component="p">

          <List dense={true}>

            <ListItem>
              <ListItemText style={{width: '80px'}} primary='Entrando' />
              <ListItemText primary={data.positive} />
              <ListItemText primary={'('+forecast.positive+')'} />
            </ListItem>

            <ListItem>
              <ListItemText style={{width: '80px'}} primary='Saindo' />
              <ListItemText primary={data.negative} />
              <ListItemText primary={'('+forecast.negative+')'} />
            </ListItem>

            <ListItem>
              <ListItemText style={{width: '80px'}} primary='Fatura' />
              <ListItemText primary={data.fatura} />
              <ListItemText primary='(R$ -878,60)' />
            </ListItem>

            <Divider/>
            <ListItem>
              <ListItemText style={{width: '80px'}} primary='Total' />
              <ListItemText primary={data.total} />
              <ListItemText primary={'('+forecast.total+')'} />
            </ListItem>


          </List>



        </Typography>
      </CardContent>
    </Card>
  );
}
