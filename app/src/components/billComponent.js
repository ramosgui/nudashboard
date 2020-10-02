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

  const [data, setData] = useState({});

  useEffect(() => {
    var host = window.location.hostname;
    var today = new Date();

    axios.get('http://' + host + ':5050/transactions/transfer_in', {}).then(res => {
      setData(res.data)
    });

  }, [props.updateData])

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Overview do mês atual
        </Typography>
        <Typography variant="body2" component="p">

          <List dense={true}>

            <ListItem>
              <ListItemText style={{width: '80px'}} primary='Renda' />
              <ListItemSecondaryAction><ListItemText primary={data.positive} /></ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText style={{width: '80px'}} primary='Gastos' />
              <ListItemSecondaryAction><ListItemText primary={data.negative} /></ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText style={{width: '80px'}} primary='Fatura do mês' />
              <ListItemSecondaryAction><ListItemText primary={data.fatura} /></ListItemSecondaryAction>
            </ListItem>

            <Divider/>
            <ListItem>
              <ListItemText style={{width: '80px'}} primary='Total' />
              <ListItemSecondaryAction><ListItemText primary={data.total} /></ListItemSecondaryAction>
            </ListItem>


          </List>



        </Typography>
      </CardContent>
    </Card>
  );
}
