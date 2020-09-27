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
import { blue } from '@material-ui/core/colors';
import { deepPurple } from '@material-ui/core/colors';
import { indigo } from '@material-ui/core/colors';
import { deepOrange } from '@material-ui/core/colors';
import { blueGrey } from '@material-ui/core/colors';
import { cyan } from '@material-ui/core/colors';
import { lightGreen } from '@material-ui/core/colors';
import { amber } from '@material-ui/core/colors';

import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PetsIcon from '@material-ui/icons/Pets';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ReceiptIcon from '@material-ui/icons/Receipt';

import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';

import MenuBookIcon from '@material-ui/icons/MenuBook';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import HomeIcon from '@material-ui/icons/Home';

import Avatar from '@material-ui/core/Avatar';

import SportsEsportsIcon from '@material-ui/icons/SportsEsports';



export const categoryIcons = {

  Carro: <Avatar style={{ backgroundColor: amber[600] }}><DriveEtaIcon /></Avatar>,
  Casa: <Avatar style={{ backgroundColor: deepPurple[500] }}><HomeIcon /></Avatar>,
  Compras: <Avatar style={{ backgroundColor: cyan[500] }}><LocalMallIcon /></Avatar>,
  Contas: <Avatar style={{ backgroundColor: blueGrey[500] }}><ReceiptIcon /></Avatar>,
  Educação: <Avatar style={{ backgroundColor: pink[500] }}><MenuBookIcon /></Avatar>,
  Games: <Avatar style={{ backgroundColor: indigo[500] }}><SportsEsportsIcon /></Avatar>,
  Gordices: <Avatar style={{ backgroundColor: amber[500] }}><FastfoodIcon /></Avatar>,
  Lazer: <Avatar style={{ backgroundColor: blue[500] }}><BeachAccessIcon /></Avatar>,
  Outros: <Avatar style={{ backgroundColor: blueGrey[300] }}><LocalOfferIcon /></Avatar>,
  Pets: <Avatar style={{ backgroundColor: indigo[300] }}><PetsIcon /></Avatar>,
  Presentes: <Avatar style={{ backgroundColor: pink[300] }}><CardGiftcardIcon /></Avatar>,
  Restaurante: <Avatar style={{ backgroundColor: orange[500] }}><RestaurantMenuIcon /></Avatar>,
  Serviços: <Avatar style={{ backgroundColor: grey[500] }}><FeaturedPlayListIcon /></Avatar>,
  Supermercado: <Avatar style={{ backgroundColor: red[500] }}><ShoppingCartIcon /></Avatar>,

  'Outras Rendas': <Avatar style={{ backgroundColor: lightGreen[500] }}><AttachMoneyIcon /></Avatar>,
  Remuneração: <Avatar style={{ backgroundColor: green[500] }}><AccountBalanceWalletIcon /></Avatar>,

  'Sem Categoria': <Avatar style={{ backgroundColor: pink['A400'] }}><AccountBalanceWalletIcon /></Avatar>,
}

export default categoryIcons