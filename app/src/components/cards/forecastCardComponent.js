import React, { useState, useEffect } from "react";
import axios from 'axios'


import CommonCardComponent from './commonCardComponent'


export default function SimpleCard(props) {

  const [forecast, setForecast] = useState({
    'positive': 0,
    'negative': 0
  });

  useEffect(() => {
    var host = window.location.hostname;
    var today = new Date();

    axios.get('http://' + host + ':5050/transactions/fixed/amount', {'params': {'startDate': new Date(today.getFullYear(), today.getMonth(), 1), 'endDate': today}}).then(res => {
      setForecast(res.data)
    });

  }, [props.updateData])

  return (
    <CommonCardComponent
      title="Planejamento do mês atual"
      data={[
        {'Renda': forecast.positive}, 
        {'Gastos fixos': forecast.negative},
        {'Gastos planejados': 'Em breve'}
      ]}
      showTotal={true}
    />
  );
}
