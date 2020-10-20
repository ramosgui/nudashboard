import React from "react";
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

  const getTotalValue = () => {

    var num = 0

    {
      props.data.map((item) => {
        for (var i in item) {
          if (typeof item[i] === 'number') {
            num = num + item[i]
          }
        }
      })
    }

    return roundToTwo(num)
  }

  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }

  function getListItemValue(item) {
    if (typeof item === 'number') {
      return 'R$ ' + item
    }
    return item
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {props.title ? props.title : "TITLE"}
        </Typography>
        <Typography variant="body2" component="p">

          <List dense={true}>

            {props.data.map((item) => {
              for (var i in item) {
                return <ListItem>
                  <ListItemText style={{ width: '80px' }} primary={i} />
                  <ListItemSecondaryAction><ListItemText primary={getListItemValue(item[i])} /></ListItemSecondaryAction>
                </ListItem>
              }
            })}

            <Divider />

            {props.showTotal ?

              <ListItem>
                <ListItemText style={{ width: '80px' }} primary='Total' />
                <ListItemSecondaryAction><ListItemText primary={'R$ ' + getTotalValue()} /></ListItemSecondaryAction>
              </ListItem>

              : undefined}





          </List>



        </Typography>
      </CardContent>
    </Card>
  );
}
