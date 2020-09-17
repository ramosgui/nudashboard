import React, { useState, useEffect } from "react";
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
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

export default function SimpleCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const [data, setData] = useState({});

  useEffect(() => {
    var host = window.location.hostname;
    axios.get('http://' + host + ':5050/transactions/last_transfer_in', {}).then(res => {
      setData(res.data)
    });
  }, [])

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Overview do Mês Passado
        </Typography>
        <Typography variant="body2" component="p">

          <List dense={true}>

            <ListItem>
              <ListItemText primary='Entrada' />
              <ListItemSecondaryAction>
                <ListItemText primary={data.positive} />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText style={{ width: '10px' }} primary='Gastos Débito' />
              <ListItemSecondaryAction>
                <ListItemText primary={data.negative} />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText primary='Fatura Passada' />
              <ListItemSecondaryAction>
                <ListItemText primary={data.fatura} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider/>
            <ListItem>
              <ListItemText primary='Total' />
              <ListItemSecondaryAction>
                <ListItemText primary={data.total} />
              </ListItemSecondaryAction>
            </ListItem>


          </List>



        </Typography>
      </CardContent>
    </Card>
  );
}
