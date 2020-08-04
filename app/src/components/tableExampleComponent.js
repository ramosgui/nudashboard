import React, { Component } from "react";
import axios from 'axios'
import MaterialTable from "material-table";
import Tooltip from '@material-ui/core/Tooltip';

import { forwardRef } from 'react';

import { green } from '@material-ui/core/colors';
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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    }
  };

  componentWillMount() {
    //console.log('CPF: ' + this.state.cpf, ' Password: ' + this.state.password + ' UUID: ' + this.state.uuid)
    axios.get('http://localhost:5050/transactions', {}).then(res => {
      const result = res.data;
      this.setState({ data: result });
    });
  }

render() {
  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        options={{
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100]
        }}
        icons={tableIcons}
        columns={[
          { title: "ID", field: "id" },
          { title: "Ref ID", field: "refId" },
          {
            title: "Title", 
            field: "title",
            render: rowData => <div>
              <div style={{float: 'left'}}>{rowData.title} {rowData.charges ? "("+rowData.chargesPaid+"/"+rowData.charges+")" : undefined}</div>
              <div style={{float: 'left', marginTop: '1px', marginLeft: '5px'}}><Tooltip title={
                <div>
                  <div>Raw Title: {rowData.rawTitle}</div>
                  <div>{rowData.titleByMap ? "Title by Map: "+rowData.titleByMap : undefined}</div>
                  <div>{rowData.titleById ? "Title by ID: "+rowData.titleById : undefined}</div>
                  <div>{rowData.titleByRef ? "Title by REF: "+rowData.titleByRef : undefined}</div>
                  </div>} arrow interactive>{rowData.titleByRef ? <LabelImportantIcon style={{ fontSize: 18, color: green[500] }}/> : rowData.titleByMap ? <LabelIcon style={{ fontSize: 18 }}/> : rowData.titleById ? <LabelImportantIcon style={{ fontSize: 18 }}/> : <LabelOffIcon style={{ fontSize: 18 }}/>}</Tooltip>
              </div>
            </div>
          },
          //{ title: "Doğum Yılı", field: "birthYear", type: "numeric" },
          {
            title: "Category", 
            field: "category",
            render: rowData => <div>
              <div style={{float: 'left'}}>{rowData.category}</div>
              <div style={{float: 'left', marginTop: '1px', marginLeft: '5px'}}><Tooltip title={
                <div>
                  <div>Raw Category: {rowData.rawCategory}</div>
                  <div>{rowData.categoryByMap ? "Category by Map: "+rowData.categoryByMap : undefined}</div>
                  <div>{rowData.categoryById ? "Category by ID: "+rowData.categoryById : undefined}</div>
                </div>} arrow interactive>{rowData.categoryByMap ? <LabelIcon style={{ fontSize: 18 }}/> : rowData.categoryById ? <LabelImportantIcon style={{ fontSize: 18 }}/> : <LabelOffIcon color='secondary' style={{ fontSize: 18 }}/>}</Tooltip>
              </div>
            </div>
            //lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
          },
          { title: "Amount", field: "amount" },
          { title: "Date", field: "dt" },
          
        ]}
        data={this.state.data}
        title="Fatural Atual"
      />
    </div>
  );
}
}

export default App;