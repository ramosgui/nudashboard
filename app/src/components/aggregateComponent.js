import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MaterialTable from "material-table";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
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

import Tooltip from '@material-ui/core/Tooltip';

import { forwardRef } from 'react';

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
import ViewColumn from '@material-ui/icons/ViewColumn'
import { green } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';

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
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default function AgreggateComponent(props) {
  const [data, setData] = useState([]);

  const amountPercent = (percentile, value, msg) => {
    if (percentile.includes('+') === true) {
      return <Tooltip title={<div><div>{msg}</div><div>{value}</div></div>} placement="top-start" arrow interactive><span style={{fontSize: '10px', color: red[500], marginLeft: '5px'}}>({percentile})</span></Tooltip>
    }
    else if (percentile.includes('-') === true){
      return <Tooltip title={<div><div>{msg}</div><div>{value}</div></div>} placement="top-start" arrow interactive><span style={{fontSize: '10px', color: green[500], marginLeft: '5px'}}>({percentile})</span></Tooltip>
    }
    else if (percentile === '0.0%') {
      return <span style={{fontSize: '10px', marginLeft: '5px'}}>({percentile})</span>
    }
    else {
      return <span style={{fontSize: '10px', marginLeft: '5px', color: red[500]}}>({percentile})</span>
    }

  }

  useEffect(() => {

    var host = window.location.hostname;
    axios.get('http://'+host+':5050/transactions/category/amount').then(res => {
      const result = res.data;
      setData(result)
    });

  }, [props.updateData])


  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        options={{
          pageSize: 12,
          pageSizeOptions: [],
          search: false,
          paging: false,
          sorting: false,
          draggable: false,
          headerStyle: {
            // backgroundColor: '#01579b',
            // color: '#FFF'
            fontWeight: 'bold'
          }
        }}
        icons={tableIcons}
        columns={[
          { title: "Category", field: "category", cellStyle: {
            width: 300,
            minWidth: 100
            },
            headerStyle: {
            width: 300,
            minWidth: 100
            }, },
          { 
            title: "Amount", 
            field: "value",
            render: rowData => <div>
              <span>{rowData.value}</span>
              <span>{amountPercent(rowData.percentileFull, rowData.lastFullValue, "Mês passado todo: ")}</span>
            </div>
          }
        ]}
        data={data}
        title="Mês atual"
      />
    </div>
  );
}