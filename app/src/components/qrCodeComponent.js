import React, { Component } from 'react'
import axios from 'axios'

export default class PersonList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            qr_code: 'qr_code',
            uuid: 'uuid'
        }
    }

    componentDidMount() {
        axios.get('http://localhost:5050/sync/qr_code').then(res => {
            const qr_code = res.data.base64;
            const uuid = res.data.uuid;
            this.setState({ qr_code });
            this.setState({ uuid });

            this.props.varTeste(res.data.uuid)
        });
    }

    render() {
        const data = this.state.qr_code
        const Example = ({ data }) => <img src={`data:image/jpeg;base64,${data}`} />;
        return <Example data={data} />
    }
}