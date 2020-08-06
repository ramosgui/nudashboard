import React, { Component } from "react";
import axios from 'axios'
import MaterialTable from "material-table";

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

class AggregateComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    }


  };

  componentDidUpdate(prevProps) {
    if (prevProps.teste !== this.props.teste) {
      axios.get('http://localhost:5050/transactions/category/amount', {'params': {'startDate': '2020-08-01', 'endDate': '2020-08-30'}}).then(res => {
        const result = res.data;
        this.setState({ data: result })
      });
    }
  }

  componentWillMount() {
    axios.get('http://localhost:5050/transactions/category/amount', {'params': {'startDate': '2020-08-01', 'endDate': '2020-08-30'}}).then(res => {
      const result = res.data;
      this.setState({ data: result })
    });
  }

  render() {
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
            { title: "Category", field: "category" },
            { title: "Amount", field: "value" },
          ]}
          data={this.state.data}
          title="Mes atual"
        />
      </div>
    );
  }
}

export default AggregateComponent;