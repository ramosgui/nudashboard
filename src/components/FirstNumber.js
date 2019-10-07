import React, { Component } from 'react'
import axios from 'axios'
import CountUp from 'react-countup';

export default class FirstNumber extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                transactionsInMonth: 0
            }
        }
    }

    componentDidMount(){
        axios.get('http://localhost:5000/transactions_in_month').then(response => {
            this.setState({data: response.data})
        });
    }

    render () {
        return <CountUp 
            prefix="Você realizou "
            end={this.state.data.transactionsInMonth}
            suffix=" compras esse mês."
        />
    }
}