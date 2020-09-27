import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import categoryIcons from './categoryComponent';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  section1: {
    margin: theme.spacing(3, 2),
  },
  section2: {
    margin: theme.spacing(2),
  },
  section3: {
    margin: theme.spacing(3, 1, 1),
  },
  list: {
    width: 350,
  },
  fullList: {
    width: 'auto',
  },
}));



export default function TemporaryDrawer(props) {
  const classes = useStyles();

  const updateCategory = (categoryName) => {
    var render = null
    Object.entries(categoryIcons)
    .map( ([key, value]) => {
      if (categoryName === key) {
        render = value
      }
    });
    props.setCurrentCategory({'icon': render, 'name': categoryName})
    props.closeDrawer()
  }

  return (
    <div>
      <Drawer anchor='right' open={props.drawerState} onClose={props.closeDrawer}>
        <div
          className={clsx(classes.list)}
          role="presentation"
        >

          {Object.entries(categoryIcons).map(([k, v]) => (
            <ListItem button key={k} onClick={() => { updateCategory(k) }}>
              <ListItemIcon>{v}</ListItemIcon>
              <ListItemText primary={k} />
            </ListItem>
          ))}

        </div>
      </Drawer>
    </div>
  );
}