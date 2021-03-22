import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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

export default function SimpleCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Overview do Mês
        </Typography>
        <Typography variant="h5" component="h2">
          Você esta indo bem!
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Seu saldo esta positivo até o momento. <span style={{ color: green[500]}}>(+25%)</span>
        </Typography>
        <Typography variant="body2" component="p">
        + R$ 2.540,00
          <br />
        -  R$ 1.500,00
        </Typography>
      </CardContent>
    </Card>
  );
}
