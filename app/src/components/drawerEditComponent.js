import React, { useState, useEffect } from 'react';
import axios from 'axios'
import clsx from 'clsx';

import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import CloseIcon from '@material-ui/icons/Close';

import DrawerViewCategory, {colors, icons} from './drawerCategoryViewComponent'


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

  const [values, setValues] = useState({});

  const [viewCategoryDrawer, setViewCategoryDrawer] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({'color': ['grey', 500]})

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
      }

    }

    setValues(auxValues);

  };

  const handleGenericChecked = (event) => {
    const auxValues = { ...values };
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


  useEffect(() => {

    if (props.categories[props.drawerData.category]) {
      var category = props.categories[props.drawerData.category]
      category['name'] = props.drawerData.category
      
    } else {
      var category = {'name': props.drawerData.category, 'color': ['grey', 500]}
    }

    
    setCurrentCategory(category)

    const auxValues = {
      'id': props.drawerData.id, 
      'trx': props.drawerData.title, 
      'category': props.drawerData.category,
      'sameCategory': props.drawerData.sameCategoryCheck,
      'sameTransactionName': props.drawerData.sameNameCheck,
      'fixedTransaction': props.drawerData.isFixed
    }
    setValues(auxValues);

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
              <Grid button >
                <CloseIcon style={{ height: '40px', width: '40px', cursor: 'pointer', marginTop: '-6px' }} onClick={props.closeDrawer} />
              </Grid>
              <Grid xs style={{ textAlign: 'center' }}>
                <Typography button gutterBottom variant="h6" style={{ fontWeight: 'bold', marginLeft: '-10px'}}>
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

              <ListItem button key={props.drawerData.category} onClick={openViewCategoryDrawer}>
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: colors[currentCategory.color[0]][currentCategory.color[1]] }} alt={currentCategory.name}>{icons[currentCategory.icon]}</Avatar>
                </ListItemAvatar>
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
      <DrawerViewCategory drawerState={viewCategoryDrawer} openDrawer={openViewCategoryDrawer} closeDrawer={closeViewCategoryDrawer} setCurrentCategory={setCurrentCategory} categories={props.categories}/>

    </Drawer>

  );
}