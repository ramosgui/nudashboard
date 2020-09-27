import React, { useState } from 'react';
import axios from 'axios'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';


import Checkbox from '@material-ui/core/Checkbox';

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

  const [useCategory, setUseCategory] = useState(false)

  const handleCategory = () => {
    setUseCategory(!useCategory)
  }

  const updateCategory = (category) => {

    if (category === 'Sem Categoria') {
      category = ''
    }

    var type = undefined
    if (useCategory === true) {
      type = 'same_name'
    } else {
      type = 'trx'
    }
    var host = window.location.hostname;
      axios.put('http://'+host+':5050/transaction/category/update', { 'id': props.drawerData.id, 'category': category, 'type': type, 'startDate': '2020-07-01', 'endDate': '2020-08-30' }).then(res => {
        props.closeDrawer()
      });
  };

  return (
    <div>

        <Drawer anchor='right' open={props.drawerState} onClose={props.closeDrawer}>
          <div
            className={clsx(classes.list)}
            role="presentation"
          >
            <Checkbox
              onChange={handleCategory}
              name="checkedB"
              color="primary"
            />Sempre usar essa categoria (Sempre que tiver uma transação com esse nome, essa categoria já vai ser escolhida.)
      {Object.entries(categoryIcons).map(([k, v]) => (
              <ListItem button key={k} onClick={() => { updateCategory(k) }}>
                <ListItemIcon>{v}</ListItemIcon>
                <ListItemText primary={k} />
              </ListItem>
            ))}</div>
        </Drawer>

    </div>
  );
}