import React, { useState, useEffect } from "react";
import axios from 'axios'


import CommonCardComponent from './commonCardComponent'


export default function SimpleCard(props) {

  const [data, setData] = useState({
    'positive': 0,
    'negative': 0,
    'old_negative': 0
  });

  useEffect(() => {
    var host = window.location.hostname;
    axios.get('http://' + host + ':5050/transactions/last_transfer_in', {}).then(res => {
      setData(res.data)
    });

  }, [props.updateData])

  return (
    <CommonCardComponent
      title="Overview do mês passado"
      data={[
        {'Entrada': data.positive}, 
        {'Gastos no mês': data.negative},
        {'Parcelas pendentes': data.old_negative}
      ]}
      showTotal={true}
    />
  );
}
