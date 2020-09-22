import React, { useState } from 'react';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import './App.css';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import TableChartIcon from '@material-ui/icons/TableChart';

import AggregateComponent from './components/aggregateComponent'
import TableExampleComponent from './components/tableExampleComponent'
import FutureTransactionsComponent from './components/futureTransactionsComponent'
import SyncModalComponent from './components/syncModalComponent'
import CardComponent from './components/cardComponent'
import BillComponent from './components/billComponent'
import LastBillComponent from './components/lastBillComponent'
import AccountAmountComponent from './components/accountAmountComponent'

const drawerWidth = 240;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#232F3E',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12);'
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: "#1B2430",
    borderRight: '1px solid rgba(0, 0, 0, 0.12);'
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    backgroundColor: "#1B2430",
    borderRight: '1px solid rgba(0, 0, 0, 0.12);'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const [openSnackBar, setSnackBar] = React.useState(false);

  const [updateTableData, setUpdateTableData] = useState([]);


  const [syncModalState, setSyncModalState] = useState(0);

  const toggleSyncModalState = () => {
    setSyncModalState(!syncModalState)
  }

  const handleOpenSnackBar = () => {
    setSnackBar(true);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBar(false);
  };


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root} style={{height: '100%'}}>
      <div className='topo'>
      </div>
      <div className='menu_lateral'>
      </div>
      <div className='corpo'>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}>
          <Alert onClose={handleCloseSnackBar} severity="success">
            This is a success message!
        </Alert>
        </Snackbar>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SyncModalComponent state={syncModalState} toggleState={toggleSyncModalState} openSnackBar={handleOpenSnackBar} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <LastBillComponent />
          </Grid>
          <Grid item xs={12} sm={3}>
            <BillComponent />
          </Grid>
          <Grid item xs={12} sm={3}>
            <AccountAmountComponent />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <AggregateComponent updateTableData={updateTableData} syncModalState={syncModalState} />
          </Grid>
          <Grid item xs={12} sm={9}>
            <FutureTransactionsComponent /><br></br>
            <TableExampleComponent openSnackBar={handleOpenSnackBar} setUpdateTableData={setUpdateTableData} syncModalState={syncModalState} />
          </Grid>
        </Grid>
      </div>


    </div>
  );
}
