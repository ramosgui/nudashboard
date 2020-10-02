import React, { useState, useEffect, forwardRef } from "react";
import axios from 'axios'

import MaterialTable, { MTableToolbar } from "material-table";

import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';

import { green } from '@material-ui/core/colors';
import { blue } from '@material-ui/core/colors';
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
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined';
import EditIcon from '@material-ui/icons/Edit';
import BlockIcon from '@material-ui/icons/Block';
import HelpIcon from '@material-ui/icons/Help';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

/* import DrawerCategory from './drawerCategoryComponent' */
import DrawerEditTransaction from './drawerEditComponent'
import DatePicker from './dateComponent';
import { colors, icons } from './drawerCategoryViewComponent';


const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  Category: forwardRef((props, ref) => <FormatListBulletedOutlinedIcon {...props} ref={ref} />),
};

const amountFunction = (amount, category) => {
  /* if (amount.includes('-')) {
    return <div style={{ color: green[500] }}>{amount}</div>
  } */ if (category === 'TransferInEvent') {
    return <div style={{ color: green[500] }}>{'R$ ' + amount}</div>
  }
  return <div>{'R$ ' + amount}</div>
}

export default function TransactionsTableComponent(props) {

  const [tableData, setTableData] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [drawerData, setDrawerData] = useState({});
  const [editDrawer, setEditDrawer] = useState(false);


  var today = new Date();
  const [startDate, setStartDate] = React.useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [endDate, setEndDate] = React.useState(today);


  const openEditDrawer = () => {
    setEditDrawer(true)
  }

  const closeEditDrawer = () => {
    setEditDrawer(false)
  }

  const toggleEditDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setEditDrawer(open);
  };

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawer(open);
  };

  const openDrawer = () => {
    setDrawer(true)
  }

  const closeDrawer = () => {
    setDrawer(false)
  }

  const calcCategoryType = () => {
    return true;
  }

  const getCategoryInfo = (rowData) => {
    var categoryInfo = tableData.categories[rowData.category]

    if (!categoryInfo) {
      var categoryInfo = {'name': rowData.category, 'color': ['grey', 500]}
    }

    return <ListItem>
      <ListItemIcon style={{minWidth: '50px'}}>
        <Avatar style={{ backgroundColor: colors[categoryInfo.color[0]][categoryInfo.color[1]] }} alt={rowData.category}>{icons[categoryInfo.icon]}</Avatar>
      </ListItemIcon>
      <ListItemText primary={<div>
        <div style={{ float: 'left' }}>{rowData.category}</div>
        <Tooltip title={
              <div>
                <div>{rowData.sameCategoryCheck ? "Nome mapeado automaticamente pela opção" : "Categoria default da transação"}</div>
                <div>{rowData.sameCategoryCheck ? '"Sempre usar esta categoria"' : <div></div>}</div>
              </div>} arrow interactive><div style={{ float: 'left', marginTop: '2px', marginLeft: '7px' }}>{rowData.sameCategoryCheck ? <HelpIcon style={{ fontSize: 15, color: blue[500] }} /> : rowData.useRawCategory ? <HelpIcon style={{ fontSize: 15, color: pink[500] }} /> : <div></div>}</div></Tooltip>
      </div>}/>
    </ListItem>
    
  }

  useEffect(() => {
    var host = window.location.hostname;
    axios.get('http://' + host + ':5050/transactions', { 'params': { 'startDate': startDate, 'endDate': endDate } }).then(res => {
      setTableData(res.data)
      props.setUpdateTableData(res.data)
    });
  }, [drawer, props.syncModalState, props.updateData])

  return (
    <div>
      {/* <Paper><div style={{ paddingLeft: '15px' }}><DatePicker setTableData={setTableData} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} /></div></Paper> */}
      <MaterialTable
        title='Transações'
        components={{
          Toolbar: props => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: '0px 20px' }}>
                <DatePicker setTableData={setTableData} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
              </div>
            </div>
          )
        }}
        localization={{
          header: {
            actions: ''
          }
        }}
        options={{
          showTitle: true,
          draggable: false,
          pageSize: 10,
          pageSizeOptions: [5, 10, 15, 25, 50, 100],
          headerStyle: {
            fontWeight: 'bold'
          },
          cellStyle: {
            padding: 1
          },
          actionsColumnIndex: -1
        }}
        icons={tableIcons}
        columns={[
          {
            title: "Tipo",
            field: "type",
            editable: 'never',
            cellStyle: {
              width: '3%'
            },
            render: rowData => {
              if (rowData.type) {
                return <Tooltip arrow placement="right" title={rowData.type}>{rowData.type === 'credit' ? <CreditCardIcon /> : <AccountBalanceWalletIcon />}</Tooltip>
              }
            }
          },
          {
            title: "Fixado",
            field: "isFixed",
            editable: 'never',
            cellStyle: {
              width: '3%'
            },
            render: rowData => {
              if (rowData.isFixed === true) {
                return <Tooltip arrow placement="right" title="Transação definida como recorrente."><LabelImportantIcon style={{ color: green[500] }}/></Tooltip>
              } else if (rowData.isFixed === 'not') {
                return <Tooltip arrow placement="right" title="Transação definida como recorrente não realizada no período selecionado."><LabelImportantIcon style={{ color: red[500] }}/></Tooltip>
              }
            }
          },
          {
            title: "Nome",
            field: "title",
            render: rowData => <div>
              <div style={{ float: 'left' }}>{rowData.title} {rowData.charges ? "(" + rowData.chargesPaid + "/" + rowData.charges + ")" : undefined}</div>
              <div style={{ float: 'left', marginTop: '2px', marginLeft: '7px' }}>
                <Tooltip
                  title={<div><div>Nome mapeado automaticamente pela opção</div><div>"Sempre usar este nome"</div></div>}
                  arrow interactive>
                  {rowData.sameNameCheck ? <HelpIcon style={{ fontSize: 15, color: blue[500] }} /> : <div></div>}</Tooltip>
              </div>
            </div>
          },
          {
            title: "Categoria",
            field: "category",
            render: rowData => getCategoryInfo(rowData)
          },
          {
            title: "Valor",
            field: "amount",
            editable: 'never',
            render: rowData => {
              if (rowData.amount) {
                return amountFunction(rowData.amount, rowData.rawCategory)
              }
            }
          },
          { title: "Data", field: "dt", editable: 'never' },
        ]}
        data={tableData.transactions}
        actions={[
          /*           {
                      icon: () => <FormatListBulletedOutlinedIcon/>,
                      tooltip: 'Categorizar',
                      onClick: (event, rowData) => {openDrawer(); setDrawerData(rowData)}
                    }, */
          {
            icon: () => <EditIcon />,
            tooltip: 'Editar',
            onClick: (event, rowData) => { openEditDrawer(); setDrawerData(rowData) }
          },
          {
            icon: () => <BlockIcon />,
            tooltip: 'Ignorar',
            onClick: (event, rowData) => alert('Not implemented')
          }
        ]}
      //editable={{
      //  onRowUpdate: (newData, oldData) =>
      //    new Promise((resolve, reject) => {
      //      setTimeout(() => {
      //        const dataUpdate = [...this.state.data];
      //        const index = oldData.tableData.id;
      //        dataUpdate[index] = newData;
      //        this.change(newData)
      //        this.props.openSnackBar()
      //        resolve();
      //      }, 1000)
      //    })
      //}}
      />
      {/* {drawer === true ? <DrawerCategory drawerState={drawer} toggleDrawer={toggleDrawer} openDrawer={openDrawer} closeDrawer={closeDrawer} categoryType={calcCategoryType} drawerData={drawerData} /> : <div />} */}
      {editDrawer === true ? <DrawerEditTransaction drawerState={editDrawer} toggleDrawer={toggleEditDrawer} openDrawer={openEditDrawer} closeDrawer={closeEditDrawer} categoryType={calcCategoryType} drawerData={drawerData} setUpdateData={props.setUpdateData} updateData={props.updateData} categories={tableData.categories}/> : <div />}
    </div>
  );



}

