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
import SyncModalComponent from './components/syncModalComponent'
import CardComponent from './components/cardComponent'


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

  const [myState, setMyState] = useState(0);
  const [open, setOpen] = React.useState(false);

  const [tableData, setTableData] = useState(undefined);

  const [openSnackBar, setSnackBar] = React.useState(false);

  const [updateTableData, setUpdateTableData] = useState([]);

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
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Overview
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar} style={{ backgroundColor: '#232F3E', color: '#EEE', borderRight: '1px solid rgba(0, 0, 0, 0.12);' }}>
          <div><TableChartIcon style={{ fontSize: '30px', float: 'left', margin: '-3px 5px 0 0' }} /></div>
          <div style={{ float: 'left', fontSize: '18px', fontWeight: '600' }}>NUDashboard</div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon style={{ color: '#EEEEEE' }} /> : <ChevronLeftIcon style={{ color: '#EEEEEE' }} />}
          </IconButton>
        </div>
        <Divider />
        <List style={{ color: '#EEEEEE' }}>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon style={{ color: '#EEEEEE' }} /> : <MailIcon style={{ color: '#EEEEEE' }} />}</ListItemIcon>
              <ListItemText style={{ color: '#EEEEEE' }} primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List style={{ color: '#EEEEEE' }}>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon style={{ color: '#EEEEEE' }} /> : <MailIcon style={{ color: '#EEEEEE' }} />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity="success">
          This is a success message!
        </Alert>
      </Snackbar>

        <Grid container spacing={3}>
        <Grid item xs={12}>
          <SyncModalComponent setTableData={setTableData} setAggregateData={setMyState} openSnackBar={handleOpenSnackBar}/>
        </Grid>
        <Grid item xs={12} sm={6}>
        <CardComponent />
        </Grid>
        <Grid item xs={12} sm={6}>
        <CardComponent />
        </Grid>
        <Grid item xs={12} sm={3}>
        <AggregateComponent teste={myState} updateTableData={updateTableData}/>
        </Grid>
        <Grid item xs={12} sm={9}>
        <TableExampleComponent teste={setMyState} tableData={tableData} openSnackBar={handleOpenSnackBar} setUpdateTableData={setUpdateTableData}/>
        </Grid>
      </Grid>

      </main>
    </div>
  );
}
