import React, { Component } from 'react'
import axios from 'axios'
import CountUp from 'react-countup';

export default class TotalTransactions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: 0
        }
    }

    getData() {
        axios.post('http://localhost:5000/', {start_date: this.props.startDate}).then(response => {
            this.setState({data: response.data.length})
        });
    }

    componentDidMount(){
        this.getData()        
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.startDate !== prevProps.startDate) {
            this.getData()
        }
        
    }

    render () {
        return <CountUp 
            prefix="Visualizando no momento "
            end={this.state.data}
            suffix=" compras."
        />
    }
}