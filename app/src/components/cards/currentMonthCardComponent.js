import React, { useState, useEffect } from "react";
import axios from 'axios'


import CommonCardComponent from './commonCardComponent'


export default function SimpleCard(props) {

  const [data, setData] = useState({
    'positive': 0,
    'negative': 0,
    'fatura': 0
  });

  useEffect(() => {
    var host = window.location.hostname;
    axios.get('http://' + host + ':5050/transactions/transfer_in', {}).then(res => {
      setData(res.data)
    });

  }, [props.updateData])

  return (
    <CommonCardComponent
      title="Overview do mês atual"
      data={[
        {'Entrada': data.positive}, 
        {'Gastos débito': data.negative},
        {'Fatura passada': data.fatura}
      ]}
      showTotal={true}
    />
/*     <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Overview do Mês
        </Typography>
        <Typography variant="h5" component="h2">
          Você esta indo bem!
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Seu saldo esta positivo até o momento. <span style={{ color: green[500]}}>(+25%)</span>
        </Typography>
        <Typography variant="body2" component="p">
        + R$ 2.540,00
          <br />
        -  R$ 1.500,00
        </Typography>
      </CardContent>
    </Card> */
  );
}
