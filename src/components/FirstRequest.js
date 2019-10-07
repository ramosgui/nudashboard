import React, { Component } from 'react'
import axios from 'axios'


export default class PrimeiraRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount(){
        axios.post('http://localhost:5000/', {start_date: '2019-10-01'}).then(response => {
            this.setState({data: response.data})
        });
    }

    render(){
        return this.state.data.map(item => <tr>
            <td>{item.id}</td>
            <td>{item.description}</td>
            <td>{item.created_at}</td>
            <td>R$ {item.amount}</td>
            <td>{item.title}</td>
        </tr>)
    } 
}
