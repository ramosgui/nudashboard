import React, { useState, useEffect} from "react";
import axios from 'axios'
import MaterialTable, {MTableToolbar} from "material-table";
import Tooltip from '@material-ui/core/Tooltip';

import { forwardRef } from 'react';

import { green } from '@material-ui/core/colors';
import { blue } from '@material-ui/core/colors';
import { pink } from '@material-ui/core/colors';

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
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined';
import EditIcon from '@material-ui/icons/Edit';
import BlockIcon from '@material-ui/icons/Block';
import HelpIcon from '@material-ui/icons/Help';
import Paper from '@material-ui/core/Paper';


import DrawerCategory from './drawerCategoryComponent'
import DrawerEditTransaction from './drawerEditComponent'
import categoryIcons from './categoryComponent';
import DatePicker from './dateComponent';



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
  if (amount.includes('-')) {
    return <div style={{ color: green[500] }}>{amount}</div>
  } else if (category === 'TransferInEvent') {
    return <div style={{ color: green[500] }}>{amount}</div>
  }
  return amount
}

const testCategoryFunction = (categoryName) => {
    var render = null
    var q = Object.entries(categoryIcons)
    .map( ([key, value]) => {
      if (categoryName === key) {
        render = value
      }
    });
      return <div><span style={{float: 'left'}}>{render}</span><span style={{float: 'left', color: 'rgba(0, 0, 0, 0.73);', marginLeft: '5px', paddingTop: '10px'}}>{categoryName}</span></div>
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

  useEffect(() => {
    var host = window.location.hostname;
    axios.get('http://'+host+':5050/transactions', { 'params': { 'startDate': startDate, 'endDate': endDate } }).then(res => {
      setTableData(res.data)
      props.setUpdateTableData(res.data)
    });
  }, [drawer, props.syncModalState, props.updateData])

  return (
    <div>
      <Paper><div style={{paddingLeft: '15px'}}><DatePicker setTableData={setTableData} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate}/></div></Paper>
      <MaterialTable
      localization={{
        header : {
           actions: ''
        }
      }}
        options={{
          showTitle: false,
          draggable: false,
          pageSize: 10,
          pageSizeOptions: [5, 10, 15, 25, 50, 100],
          headerStyle: {
            fontWeight: 'bold',
            hidden: true,
          },
          actionsColumnIndex: -1
        }}
        icons={tableIcons}
        columns={[
          {
            field: "type",
            editable: 'never',
            render: rowData => <Tooltip arrow placement="right" title={rowData.type}>{rowData.type === 'credit' ? <CreditCardIcon /> : <AccountBalanceWalletIcon />}</Tooltip>
          },
          {
            field: "isFixed",
            editable: 'never',
            render: rowData => <Tooltip arrow placement="right" title="Transação definida como recorrente.">{rowData.isFixed === true ? <LabelImportantIcon /> : <span/>}</Tooltip>
          },
          {
            title: "Nome",
            field: "title",
            render: rowData => <div>
              <div style={{ float: 'left' }}>{rowData.title} {rowData.charges ? "(" + rowData.chargesPaid + "/" + rowData.charges + ")" : undefined}</div>
              <div style={{ float: 'left', marginTop: '-5px', marginLeft: '2px' }}>
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
            editComponent: props => (
              <div>
                <select id="type" onChange={e => this.a = e.target.value}>
                  <option>-</option>
                  <option value="trx">Apenas essa transação</option>
                  <option value="same_name">Todas transações com o mesmo nome</option>
                </select>
                <input
                  type="text"
                  value={props.value}
                  onChange={e => props.onChange(e.target.value)}
                /></div>
            ),
            render: rowData => <div>
              <div style={{ float: 'left' }}>

                {testCategoryFunction(rowData.category)}




              </div>
              <div style={{ float: 'left', marginTop: '5px', marginLeft: '2px' }}><Tooltip title={
                <div>
                  <div>{rowData.sameCategoryCheck ? "Nome mapeado automaticamente pela opção" : "Categoria default da transação"}</div>
              <div>{rowData.sameCategoryCheck ? '"Sempre usar esta categoria"' : <div></div>}</div>
              </div>} arrow interactive>{rowData.sameCategoryCheck ? <HelpIcon style={{ fontSize: 15, color: blue[500] }} /> : rowData.useRawCategory ? <HelpIcon style={{ fontSize: 15, color: pink[500] }} /> : <div></div>}</Tooltip>
              </div>
            </div>
            //lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
          },
          {
            title: "Valor",
            field: "amount",
            editable: 'never',
            render: rowData => amountFunction(rowData.amount, rowData.rawCategory)
          },
          { title: "Data", field: "dt", editable: 'never' },
        ]}
        data={tableData}
        actions={[
/*           {
            icon: () => <FormatListBulletedOutlinedIcon/>,
            tooltip: 'Categorizar',
            onClick: (event, rowData) => {openDrawer(); setDrawerData(rowData)}
          }, */
          {
            icon: () => <EditIcon/>,
            tooltip: 'Editar',
            onClick: (event, rowData) => {openEditDrawer(); setDrawerData(rowData)}
          },
          {
            icon: () => <BlockIcon/>,
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
      <DrawerCategory drawerState={drawer} toggleDrawer={toggleDrawer} openDrawer={openDrawer} closeDrawer={closeDrawer} categoryType={calcCategoryType} drawerData={drawerData}/>
      <DrawerEditTransaction drawerState={editDrawer} toggleDrawer={toggleEditDrawer} openDrawer={openEditDrawer} closeDrawer={closeEditDrawer} categoryType={calcCategoryType} drawerData={drawerData} setUpdateData={props.setUpdateData} updateData={props.updateData}/>
    </div>
  );



}

