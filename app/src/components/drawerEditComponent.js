import React, { useState, useEffect } from 'react';
import axios from 'axios'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { green } from '@material-ui/core/colors';
import { orange } from '@material-ui/core/colors';
import { yellow } from '@material-ui/core/colors';
import { grey } from '@material-ui/core/colors';
import { pink } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import LabelOffIcon from '@material-ui/icons/LabelOff';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import LabelIcon from '@material-ui/icons/Label';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import FastfoodOutlinedIcon from '@material-ui/icons/FastfoodOutlined';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import PetsOutlinedIcon from '@material-ui/icons/PetsOutlined';
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';
import DriveEtaOutlinedIcon from '@material-ui/icons/DriveEtaOutlined';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import FeaturedPlayListOutlinedIcon from '@material-ui/icons/FeaturedPlayListOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import CardGiftcardOutlinedIcon from '@material-ui/icons/CardGiftcardOutlined';
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';

import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';


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


const categoryIcons = {
  Gordices: <span className='circle' style={{ borderColor: orange[500] }}><FastfoodOutlinedIcon style={{ color: orange[500] }} /></span>,
  Supermercado: <span className='circle' style={{ borderColor: green[500] }}><ShoppingCartOutlinedIcon style={{ color: green[500] }} /></span>,
  Pets: <span className='circle'><PetsOutlinedIcon /></span>,
  Carro: <span className='circle' style={{ borderColor: yellow[600] }}><DriveEtaOutlinedIcon style={{ color: yellow[600] }} /></span>,
  Compras: <span className='circle'><LocalMallOutlinedIcon /></span>,
  Serviços: <span className='circle' style={{ borderColor: grey[500] }}><FeaturedPlayListOutlinedIcon style={{ color: grey[500] }} /></span>,
  Casa: <span className='circle'><HomeOutlinedIcon /></span>,
  Presentes: <span className='circle' style={{ borderColor: pink[300] }}><CardGiftcardOutlinedIcon style={{ color: pink[300] }} /></span>,
  'Sem Categoria': <span className='circle' style={{ borderColor: pink[300] }}><AccountBalanceWalletOutlinedIcon style={{ color: red[500] }} /></span>,
}



export default function TemporaryDrawer(props) {
  const classes = useStyles();

  const [values, setValues] = useState({ });
  const [checked, setChecked] = React.useState(false);
  const [chargeChecked, setChargeChecked] = React.useState(false);

  const handleChange = (event) => {
    const auxValues = { ...values };
    auxValues[event.target.name] = event.target.value;
    setValues(auxValues);
    console.log(event.target.name, event.target.value, values)
  };

  const handleChecked = (event) => {
    setChecked(event.target.checked);
    const auxValues = { ...values };
    auxValues[event.target.name] = event.target.checked;
    setValues(auxValues);
  };

  const handleChargeChecked = (event) => {
    setChargeChecked(event.target.checked);
    const auxValues = { ...values };
    auxValues[event.target.name] = event.target.checked;
    setValues(auxValues);
  };

  const updateTransaction = () => {
    var host = window.location.hostname;
      axios.post('http://'+host+':5050/transaction/update', {'id': props.drawerData.id, 
      'sameTransactionName': values.sameTransactionName, 
      'transactionName': values.transactionName,
       'sameTransactionCharge': values.sameTransactionCharge}).then(res => {
        props.closeDrawer()
      });
  };

  useEffect(() => {
    setValues({'transactionName': props.drawerData.title, 'sameTransactionName': false, 'sameTransactionCharge': false});
    setChecked(false);
    setChargeChecked(false);
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
        <TextField id="transaction_name" name='transactionName' label="Nome da Transação" defaultValue={props.drawerData.title} onChange={handleChange}/>
        <TextField disabled id="amount" value={props.drawerData.amount}/>
        <TextField disabled id="date" value={props.drawerData.dt}/>
        </div>
        <div className={classes.section1}>
        <FormControlLabel
        control={
          <Checkbox
          checked={checked}
          onChange={handleChecked}
            name="sameTransactionName"
            color="primary"
          />
        }
        label="Sempre usar esta descrição. (Altera automaticamente transações com o mesmo nome)"
      />
      <FormControlLabel
        control={
          <Checkbox
          checked={chargeChecked}
          onChange={handleChargeChecked}
            name="sameTransactionCharge"
            color="primary"
          />
        }
        label="Sempre usar esta descrição para as transações da mesma parcela. (Altera automaticamente transações da mesma compra)"
      />
      </div>
      <Divider variant="middle" />
      <div className={classes.section2}>
      <Button variant="contained" color="primary" onClick={updateTransaction}> 
  Salvar
</Button>
<Button variant="contained" color="secondary" onClick={() => {alert('Not Implemented')}} tooltip='AAAA'> 
  Restore
</Button>

      </div>

    </div>

</div>
        </Drawer>

  );
}