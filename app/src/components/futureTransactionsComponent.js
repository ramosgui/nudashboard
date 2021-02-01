import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import { colors, icons } from './drawerCategoryViewComponent';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

/* const categories = () => {
  var a = categoryIcons
  return a;
} */

const testCategoryFunction = (categoryName, categories) => {
  var render = null

  var categoryInfo = categories[categoryName]

  console.log(categories)

  if (categoryInfo === undefined) {
    return null
  } else {
    console.log(categoryInfo)
    return <Avatar style={{ backgroundColor: colors[categoryInfo.color[0]][categoryInfo.color[1]] }} alt={categoryName}>{icons[categoryInfo.icon]}</Avatar>
  }
    
}

export default function SimpleAccordion(props) {
  const classes = useStyles();

  const [tableData, setTableData] = useState({'transactions': []});

  

  useEffect(() => {
    var host = window.location.hostname;
    axios.get('http://' + host + ':5050/future_transactions', {}).then(res => {
      setTableData(res.data)
    });
  }, [])

  const transactionName = (transaction) => {
    return <div><span>{transaction.title}</span> <span>{transaction.charges ? "(" + transaction.chargesPaid + "/" + transaction.charges + ")" : undefined}</span></div>
  }

  function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>+ <span style={{fontWeight: "bold"}}>{tableData.qtd}</span> Transações até ao final do mês (Previsão) <span>({'R$ '+roundToTwo(tableData.value)})</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{ width: '100%' }} >
            <List>

              {tableData.transactions.map((transaction, index) => (
                <div><Divider />
                <ListItem>
                <ListItemAvatar>

                  {testCategoryFunction(transaction.category, tableData.categories)}

                </ListItemAvatar>
                <ListItemText  style={{width: '1px'}} primary={transactionName(transaction)} secondary={transaction.category}/>
                <ListItemText primary={'R$ ' + transaction.amount} secondary={transaction.type}/>
                <ListItemText primary={transaction.dt}/>
              </ListItem>
                
                </div>
              ))}

            </List>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
