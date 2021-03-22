import React, { useState, useEffect } from "react";
import axios from 'axios'


import CommonCardComponent from './commonCardComponent'


export default function SimpleCard(props) {

  const [data, setData] = useState({
    'account_total': 0,
    'bill_out': 0
  });

  useEffect(() => {
    var host = window.location.hostname;
    var today = new Date();

    axios.get('http://' + host + ':5050/account/amount').then(res => {
      setData(res.data)
    });

  }, [props.updateData])

  return (
    <CommonCardComponent
      title="Conta"
      data={[
        {'Conta': data.account_total}, 
        {'Fatura do mês': data.bill_out}
      ]}
      showTotal={true}
    />
  );
}
