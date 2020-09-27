import React, { useState, useEffect } from 'react';
import axios from 'axios'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import categoryIcons from './categoryComponent';
import DrawerViewCategory from './drawerCategoryViewComponent'

import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';


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
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  fullList: {
    width: 'auto',
  },
}));



export default function TemporaryDrawer(props) {
  const classes = useStyles();

  const [values, setValues] = useState({
    'sameCategory': null,
    'sameTransactionName': null,
    'sameTransactionCharge': null,
    'fixedTransaction': null,
    'defaultTransactionName': null
  });

  const [viewCategoryDrawer, setViewCategoryDrawer] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({})

  const openViewCategoryDrawer = () => {
    setViewCategoryDrawer(true)
  }

  const closeViewCategoryDrawer = () => {
    setViewCategoryDrawer(false)
  }

  const handleChange = (event) => {
    const auxValues = { ...values };
    auxValues[event.target.name] = event.target.value;
    
    if (event.target.name === 'trx') {

      if (event.target.value === props.drawerData.title) {
        auxValues['sameTransactionName'] = props.drawerData.sameNameCheck
        auxValues['fixedTransaction'] = props.drawerData.isFixed

      } else {
        auxValues['sameTransactionName'] = false
        auxValues['fixedTransaction'] = false
      }
    }

    setValues(auxValues);

  };

  const handleGenericChecked = (event) => {
    const auxValues = { ...values };
    console.log(event.target.name, event.target.checked)
    auxValues[event.target.name] = event.target.checked;
    setValues(auxValues);
  };

  const updateTransaction = () => {
    var host = window.location.hostname;
    const auxValues = { ...values }

    auxValues['category'] = currentCategory.name

    axios.post('http://' + host + ':5050/transaction/update', { auxValues }).then(res => {
      props.closeDrawer()
      props.setUpdateData(!props.updateData)
    });
  };

  const getCategoryIcon = (categoryName) => {
    var render = null
    var q = Object.entries(categoryIcons)
      .map(([key, value]) => {
        if (categoryName === key) {
          render = value
        }
      });
    return { 'icon': render, 'name': categoryName }
  }

  useEffect(() => {

    const auxValues = {
      'id': props.drawerData.id, 
      'trx': props.drawerData.title, 
      'category': props.drawerData.category,
      'sameCategory': props.drawerData.sameCategoryCheck,
      'sameTransactionName': props.drawerData.sameNameCheck,
      'fixedTransaction': props.drawerData.isFixed
    }
    setValues(auxValues);
    
    var icon = null
    icon = getCategoryIcon(props.drawerData.category)
    setCurrentCategory(icon)

    console.log(props.drawerData)

  }, [props.drawerState])


  return (

    <Drawer anchor='right' open={props.drawerState} onClose={props.closeDrawer}>
      <div
        className={clsx(classes.list)}
        role="presentation"
      >

        <div className={classes.root}>
          <div className={classes.section1}>
            <Grid container alignItems="center">
              <Grid item>
                <Typography gutterBottom variant="h6">
                  X
            </Typography>
              </Grid>
              <Grid item xs>
                <Typography gutterBottom variant="h6">
                  Editar Transação
            </Typography>
              </Grid>
            </Grid>
            <TextField id="transaction_name" name='trx' label="Nome" defaultValue={props.drawerData.title} onChange={handleChange} />
            <TextField disabled id="amount" value={props.drawerData.amount} />
            <TextField disabled id="date" value={props.drawerData.dt} />
          </div>
          <div className={classes.section1}>
            <FormControl component="fieldset">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.sameTransactionName}
                      onChange={handleGenericChecked}
                      name="sameTransactionName"
                      color="primary"
                    />
                  }
                  label="Sempre usar este nome"
                />
                <FormHelperText>Todas transações com o nome <b>{props.drawerData.rawTitle}</b> serão automaticamente nomeadas para <b>{values.trx}</b>.</FormHelperText>
              </FormGroup>

              <br />

              <FormGroup aria-label="position" row>
                <FormControlLabel
                  value="end"
                  control={
                    <Checkbox 
                      checked={values.fixedTransaction}
                      onChange={handleGenericChecked}
                      color="primary" 
                      name="fixedTransaction"
                    />
                  }
                  label="Definir como transação fixa"
                  labelPlacement="end"
                />
                <FormHelperText>A transação será espelhada nos próximos meses, assim aparecendo em transações futuras. Todas transações com o nome <b>{values.trx}</b> terão o gasto médio calculado e entrará nas métricas.</FormHelperText>
              </FormGroup>

              {/*<br />

              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.defaultTransactionName}
                      onChange={handleGenericChecked}
                      name="defaultTransactionName"
                      color="primary"
                    />
                  }
                  label="Restaurar nome da transação."
                />
                <FormHelperText>Restaura o nome "default" da transação.</FormHelperText>
                </FormGroup>*/}
              
            </FormControl>
          </div>
          <Divider variant="middle" />
          <div className={classes.section1}>
            <span >

              <ListItem button key={currentCategory.name} onClick={openViewCategoryDrawer}>
                <ListItemAvatar>{currentCategory.icon}</ListItemAvatar>
                <ListItemText primary={currentCategory.name} />
                <ListItemText style={{marginLeft: '15px'}} primary={<ArrowRightAltIcon/>}/>
              </ListItem>

              <FormControl component="fieldset">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.sameCategory}
                        onChange={handleGenericChecked}
                        name="sameCategory"
                        color="primary"
                      />
                    }
                    label="Sempre usar esta categoria"
                  />
                  <FormHelperText>Com isso, a categoria <b>{currentCategory.name}</b> será escolhida automaticamente para todas transações com o nome <b>{values.trx}</b>.</FormHelperText>
                </FormGroup>

              </FormControl>

            </span>
          </div>
          <Divider variant="middle" />
          <div className={classes.section2}>
            <span><Button variant="contained" color="primary" onClick={updateTransaction}>
              Salvar
</Button></span>

            <span>
              <Button style={{ marginLeft: '10px' }} variant="contained" color="secondary" onClick={() => { alert('Not Implemented') }} tooltip='AAAA'>
                Restore
</Button></span>

          </div>

        </div>

      </div>
      <DrawerViewCategory drawerState={viewCategoryDrawer} openDrawer={openViewCategoryDrawer} closeDrawer={closeViewCategoryDrawer} setCurrentCategory={setCurrentCategory} />

    </Drawer>

  );
}