import React, { Component } from "react";
import axios from 'axios'
import MaterialTable, { MTableToolbar } from "material-table";
import {MTableBodyRow} from "material-table";
import {MTableAction} from "material-table";
import Tooltip from '@material-ui/core/Tooltip';

import { forwardRef } from 'react';

import { green } from '@material-ui/core/colors';
import { orange } from '@material-ui/core/colors';
import { yellow } from '@material-ui/core/colors';
import { grey } from '@material-ui/core/colors';
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

import DrawerCategory from './drawerCategoryComponent'

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

const categoryIcons = {
  Gordices: <span className='circle' style={{borderColor: orange[500]}}><FastfoodOutlinedIcon style={{color: orange[500]}}/></span>,
  Supermercado: <span className='circle' style={{borderColor: green[500]}}><ShoppingCartOutlinedIcon style={{color: green[500]}}/></span>,
  Pets: <span className='circle'><PetsOutlinedIcon/></span>,
  Carro: <span className='circle' style={{borderColor: yellow[600]}}><DriveEtaOutlinedIcon style={{color: yellow[600]}}/></span>,
  'Outras Rendas': <span className='circle' style={{borderColor: green[600]}}><AttachMoneyOutlinedIcon style={{color: green[600]}}/></span>,
  Compras: <span className='circle'><LocalMallOutlinedIcon/></span>,
  Serviços: <span className='circle' style={{borderColor: grey[500]}}><FeaturedPlayListOutlinedIcon style={{color: grey[500]}}/></span>,
  Casa: <span className='circle'><HomeOutlinedIcon/></span>,
  Presentes: <span className='circle' style={{borderColor: pink[300]}}><CardGiftcardOutlinedIcon style={{color: pink[300]}}/></span>,
}


class tableExampleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      drawer: false,
      drawerData: {}
    }

  };

  renderOptions(id) {
    var a = this.state.options === id.id ? {display: 'auto'} : {display: 'none'}
    console.log(id.title)
    return a
  }

  toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    this.setState({drawer: open});
  };

  openDrawer(rowData) {
    this.setState({drawer: true});
    this.setState({drawerData: rowData})
  };

  componentDidMount() {
    axios.get('http://localhost:5050/transactions', { 'params': { 'startDate': '2020-07-01', 'endDate': '2020-08-30' } }).then(res => {
      const result = res.data;
      this.setState({ data: result });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tableData !== this.props.tableData) {
      axios.get('http://localhost:5050/transactions', { 'params': { 'startDate': '2020-07-01', 'endDate': '2020-08-30' } }).then(res => {
        const result = res.data;
        this.setState({ data: result });
      });
    }
  }

  change(data) {
    if (this.change_title_type) {
      axios.put('http://localhost:5050/transaction/title/update', { 'id': data.id, 'title': data.title, 'type': this.change_title_type, 'startDate': '2020-07-01', 'endDate': '2020-08-30' }).then(res => {
        const result = res.data;
        this.setState({ data: result });
      });
      this.change_title_type = undefined
    }

    if (this.a) {
      axios.put('http://localhost:5050/transaction/category/update', { 'id': data.id, 'category': data.category, 'type': this.a, 'startDate': '2020-07-01', 'endDate': '2020-08-30' }).then(res => {
        const result = res.data;
        this.props.teste(result)
        this.setState({ data: result });
      });
      this.a = undefined
    }
  }

  amountFunction(amount, category) {
    if (amount.includes('-')) {
      return <div style={{ color: green[500] }}>{amount}</div>
    } else if (category === 'TransferInEvent') {
      return <div style={{ color: green[500] }}>{amount}</div>
    }
    return amount
  }

  testCategoryFunction(categoryName){
    var render = null
    var q = Object.entries(categoryIcons)
    .map( ([key, value]) => {
      if (categoryName === key) {
        render = value
      }
    });
      return <div><span style={{float: 'left'}}>{render}</span><span style={{float: 'left', color: 'rgba(0, 0, 0, 0.73);', marginLeft: '5px', paddingTop: '10px'}}>{categoryName}</span></div>
    
    
  }

  render() {
    return (
      <div>
        <MaterialTable
        localization={{
          header : {
             actions: ''
          }
        }}
          options={{
            draggable: false,
            pageSize: 10,
            pageSizeOptions: [5, 10, 15, 25, 50, 100],
            headerStyle: {
              fontWeight: 'bold'
            },
            actionsColumnIndex: -1
          }}
          icons={tableIcons}
          columns={[
            {
              title: "Type",
              field: "type",
              editable: 'never',
              render: rowData => <Tooltip arrow placement="right" title={rowData.type}>{rowData.type === 'credit' ? <CreditCardIcon /> : <AccountBalanceWalletIcon />}</Tooltip>
            },
            {
              title: "Title",
              field: "title",
              editComponent: props => (
                <div>
                  <select id="type" onChange={e => this.change_title_type = e.target.value}>
                    <option>-</option>
                    <option value="trx">Apenas essa transação</option>
                    <option value="same_name">Todas transações com o mesmo nome</option>
                    <option value="charges">Todas as parcelas</option>
                  </select>
                  <input
                    type="text"
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                  /></div>
              ),
              render: rowData => <div>
                <div style={{ float: 'left' }}>{rowData.title} {rowData.charges ? "(" + rowData.chargesPaid + "/" + rowData.charges + ")" : undefined}</div>
                <div style={{ float: 'left', marginTop: '1px', marginLeft: '5px' }}><Tooltip title={
                  <div>
                    <div>Título default: {rowData.rawTitle}</div>
                    <div>{rowData.titleByMap ? "Título pelo nome default: " + rowData.titleByMap : undefined}</div>
                    <div>{rowData.titleByRef ? "Título de todas parcelas: " + rowData.titleByRef : undefined}</div>
                    <div>{rowData.titleById ? "Título pelo ID: " + rowData.titleById : undefined}</div>
                  </div>} arrow interactive>{rowData.titleById ? <LabelImportantIcon style={{ fontSize: 18 }} /> : rowData.titleByRef ? <LabelIcon style={{ fontSize: 18, color: green[500] }} /> : rowData.titleByMap ? <LabelIcon style={{ fontSize: 18 }} /> : <LabelOffIcon style={{ fontSize: 18 }} />}</Tooltip>
                </div>
              </div>
            },
            {
              title: "Category",
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

                  {this.testCategoryFunction(rowData.category)}




                </div>
                <div style={{ float: 'left', marginTop: '1px', paddingTop: '10px'}}><Tooltip title={
                  <div>
                    <div>Categoria default: {rowData.rawCategory}</div>
                    <div>{rowData.categoryByMap ? "Categoria pela nome da transação: " + rowData.categoryByMap : undefined}</div>
                    <div>{rowData.categoryById ? "Categoria pelo ID da transação: " + rowData.categoryById : undefined}</div>
                  </div>} arrow interactive>{rowData.categoryById ? <LabelImportantIcon style={{ fontSize: 18 }} /> : rowData.categoryByMap ? <LabelIcon style={{ fontSize: 18 }} /> : <LabelOffIcon color='secondary' style={{ fontSize: 18 }} />}</Tooltip>
                </div>
              </div>
              //lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
            },
            {
              title: "Amount",
              field: "amount",
              editable: 'never',
              render: rowData => this.amountFunction(rowData.amount, rowData.rawCategory)
            },
            { title: "Date", field: "dt", editable: 'never' },
          ]}
          data={this.state.data}
          actions={[
            {
              icon: () => <FormatListBulletedOutlinedIcon/>,
              tooltip: 'Categorizar',
              onClick: (event, rowData) => this.openDrawer(rowData)
            }
          ]}
          editable={{
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...this.state.data];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  this.change(newData)
                  this.props.openSnackBar()
                  resolve();
                }, 1000)
              })
          }}
          title="Transações"
        />
        <DrawerCategory drawerState={this.state.drawer} toggleDrawer={this.toggleDrawer} data={this.state.drawerData}/>
      </div>
    );
  }
}

export default tableExampleComponent;