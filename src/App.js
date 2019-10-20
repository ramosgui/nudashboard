import React from 'react'

import TransactionMonth from './components/transactionsMonthCount';
import TotalTransactions from './components/totalTransactions';
import PeriodFilter from './components/periodFilter';
import NewTable from './components/newTable';


export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            startDate: '2019-10-01'
        };
    }

    testeFuncao = startDateGet => {
        this.setState({ startDate: startDateGet}) 
    }

    render() {
        return <>
        <PeriodFilter test={this.testeFuncao} />
        <TotalTransactions startDate={this.state.startDate}/>
        <TransactionMonth />
        <NewTable startDate={this.state.startDate}/>
    </>
        
    }
}
