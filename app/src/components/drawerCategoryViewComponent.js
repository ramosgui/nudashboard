import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { green } from '@material-ui/core/colors';
import { orange } from '@material-ui/core/colors';
import { grey } from '@material-ui/core/colors';
import { pink } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';
import { blue } from '@material-ui/core/colors';
import { deepPurple } from '@material-ui/core/colors';
import { indigo } from '@material-ui/core/colors';
import { blueGrey } from '@material-ui/core/colors';
import { cyan } from '@material-ui/core/colors';
import { lightGreen } from '@material-ui/core/colors';
import { amber } from '@material-ui/core/colors';
import { deepOrange } from '@material-ui/core/colors';
import { teal } from '@material-ui/core/colors';
import { lime } from '@material-ui/core/colors';
import { brown } from '@material-ui/core/colors';
import { yellow } from '@material-ui/core/colors';


import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ReceiptIcon from '@material-ui/icons/Receipt';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import HomeIcon from '@material-ui/icons/Home';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import PersonIcon from '@material-ui/icons/Person';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import FastfoodTwoToneIcon from '@material-ui/icons/FastfoodTwoTone';
import LocalMallTwoToneIcon from '@material-ui/icons/LocalMallTwoTone';
import ShoppingCartTwoToneIcon from '@material-ui/icons/ShoppingCartTwoTone';
import ReceiptTwoToneIcon from '@material-ui/icons/ReceiptTwoTone';
import LiveTvTwoToneIcon from '@material-ui/icons/LiveTvTwoTone';
import GradeTwoToneIcon from '@material-ui/icons/GradeTwoTone';
import SportsEsportsTwoToneIcon from '@material-ui/icons/SportsEsportsTwoTone';
import AttachMoneyTwoToneIcon from '@material-ui/icons/AttachMoneyTwoTone';
import MonetizationOnTwoToneIcon from '@material-ui/icons/MonetizationOnTwoTone';
import DesktopWindowsTwoToneIcon from '@material-ui/icons/DesktopWindowsTwoTone';
import RestaurantTwoToneIcon from '@material-ui/icons/RestaurantTwoTone';
import LaptopChromebookTwoToneIcon from '@material-ui/icons/LaptopChromebookTwoTone';
import PetsTwoToneIcon from '@material-ui/icons/PetsTwoTone';
import LocalGasStationTwoToneIcon from '@material-ui/icons/LocalGasStationTwoTone';
import DriveEtaTwoToneIcon from '@material-ui/icons/DriveEtaTwoTone';
import LocalTaxiTwoToneIcon from '@material-ui/icons/LocalTaxiTwoTone';
import LocalHospitalTwoToneIcon from '@material-ui/icons/LocalHospitalTwoTone';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
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


export const colors = {
  'blueGrey': blueGrey,
  'lightGreen': lightGreen,
  'red': red,
  'deepPurple': deepPurple,
  'deepOrange': deepOrange,
  'indigo': indigo,
  'amber': amber,
  'grey': grey,
  'orange': orange,
  'blue': blue,
  'cyan': cyan,
  'pink': pink,
  'green': green,
  'teal': teal,
  'lime': lime,
  'brown': brown,
  'yellow': yellow
}


export const icons = {
  'LocalMallIcon': <LocalMallIcon />,
  'ReceiptIcon': <ReceiptIcon />,
  'MenuBookIcon': <MenuBookIcon />,
  'ShoppingCartIcon': <ShoppingCartIcon />,
  'HomeIcon': <HomeIcon />,
  'LocalHospitalIcon': <LocalHospitalIcon />,
  'DriveEtaIcon': <DriveEtaIcon />,
  'RestaurantMenuIcon': <RestaurantMenuIcon />,
  'SportsEsportsIcon': <SportsEsportsIcon />,
  'FastfoodIcon': <FastfoodIcon />,
  'BeachAccessIcon': <BeachAccessIcon />,
  'FeaturedPlayListIcon': <FeaturedPlayListIcon />,
  'PersonIcon': <PersonIcon />,
  'LocalOfferIcon': <LocalOfferIcon />,
  'CardGiftcardIcon': <CardGiftcardIcon />,
  'AccountBalanceWalletIcon': <AccountBalanceWalletIcon />,
  'AttachMoneyIcon': <AttachMoneyIcon />,
  'LocalBarIcon': <LocalBarIcon/>,
  'HomeTwoToneIcon': <HomeTwoToneIcon/>,
  'LocalMallOutlinedIcon': <LocalMallOutlinedIcon/>,
  'FastfoodTwoToneIcon': <FastfoodTwoToneIcon/>,
  'LocalMallTwoToneIcon': <LocalMallTwoToneIcon/>,
  'ShoppingCartTwoToneIcon': <ShoppingCartTwoToneIcon/>,
  'ReceiptTwoToneIcon': <ReceiptTwoToneIcon/>,
  'LiveTvTwoToneIcon': <LiveTvTwoToneIcon/>,
  'GradeTwoToneIcon': <GradeTwoToneIcon/>,
  'SportsEsportsTwoToneIcon': <SportsEsportsTwoToneIcon/>,
  'AttachMoneyTwoToneIcon': <AttachMoneyTwoToneIcon/>,
  'MonetizationOnTwoToneIcon': <MonetizationOnTwoToneIcon/>,
  'DesktopWindowsTwoToneIcon': <DesktopWindowsTwoToneIcon/>,
  'RestaurantTwoToneIcon': <RestaurantTwoToneIcon/>,
  'LaptopChromebookTwoToneIcon': <LaptopChromebookTwoToneIcon/>,
  'PetsTwoToneIcon': <PetsTwoToneIcon/>,
  'LocalGasStationTwoToneIcon': <LocalGasStationTwoToneIcon/>,
  'DriveEtaTwoToneIcon': <DriveEtaTwoToneIcon/>,
  'LocalTaxiTwoToneIcon': <LocalTaxiTwoToneIcon/>,
  'LocalHospitalTwoToneIcon': <LocalHospitalTwoToneIcon/>
}


export default function TemporaryDrawer(props) {
  const classes = useStyles();

  const updateCategory = (category) => {
    props.setCurrentCategory(category)
    props.closeDrawer()
  }


  const getCategories = (categoryType) => {
    var categories = []
    for (var key in props.categories) {
      var category = props.categories[key]
      category['name'] = key

      if (category.type === categoryType) {
        categories.push(category)
      }
    }
    return categories
  }

  return (
    <div>
      <Drawer anchor='right' open={props.drawerState} onClose={props.closeDrawer}>
        <div
          className={clsx(classes.list)}
          role="presentation"
        >

          <div className={classes.section1}>
            <Grid container alignItems="center">
              <Grid button >
                <ArrowLeftIcon style={{ height: '40px', width: '40px', cursor: 'pointer', marginTop: '-6px' }} onClick={props.closeDrawer} />
              </Grid>
              <Grid xs style={{ textAlign: 'center' }}>
                <Typography button gutterBottom variant="h6" style={{ fontWeight: 'bold', marginLeft: '-10px'}}>
                  Alterar categoria
          </Typography>
              </Grid>
            </Grid>
          </div>

          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Essencial
        </ListSubheader>
            }
            className={classes.root}
          >

            {getCategories('Gastos essenciais').map((category) => {
              return (
                <ListItem button onClick={() => updateCategory(category)}>
                  <ListItemIcon>
                    <Avatar style={{ backgroundColor: colors[category.color[0]][category.color[1]] }} alt={category.name}>{icons[category.icon]}</Avatar>
                  </ListItemIcon>
                  <ListItemText primary={category.name} />
                </ListItem>
              )
            })}

          </List>

          <Divider />

          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Estilo de vida
        </ListSubheader>
            }
            className={classes.root}
          >

            {getCategories('Estilo de vida').map((category) => {
              return (
                <ListItem button onClick={() => updateCategory(category)}>
                  <ListItemIcon>
                    <Avatar style={{ backgroundColor: colors[category.color[0]][category.color[1]] }} alt={category.name}>{icons[category.icon]}</Avatar>
                  </ListItemIcon>
                  <ListItemText primary={category.name} />
                </ListItem>
              )
            })}


          </List>

          <Divider />

          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Não classificado
        </ListSubheader>
            }
            className={classes.root}
          >

            {getCategories('Nao classificado').map((category) => {
              return (
                <ListItem button onClick={() => updateCategory(category)}>
                  <ListItemIcon>
                    <Avatar style={{ backgroundColor: colors[category.color[0]][category.color[1]] }} alt={category.name}>{icons[category.icon]}</Avatar>
                  </ListItemIcon>
                  <ListItemText primary={category.name} />
                </ListItem>
              )
            })}

          </List>

          <Divider />

          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">Renda</ListSubheader>
            }
            className={classes.root}
          >

            {getCategories('Renda').map((category) => {
              return (
                <ListItem button onClick={() => updateCategory(category)}>
                  <ListItemIcon>
                    <Avatar style={{ backgroundColor: colors[category.color[0]][category.color[1]] }} alt={category.name}>{icons[category.icon]}</Avatar>
                  </ListItemIcon>
                  <ListItemText primary={category.name} />
                </ListItem>
              )
            })}

          </List>

        </div>
      </Drawer>
    </div>
  );
}