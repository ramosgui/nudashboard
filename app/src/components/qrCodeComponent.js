import React from 'react'
import axios from 'axios'

export default class PersonList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            qr_code: null,
            uuid: 'uuid'
        }
    }

    componentDidMount() {
        var host = window.location.hostname;
        axios.get('http://'+host+':5050/sync/qr_code').then(res => {
            const qr_code = res.data.base64;
            const uuid = res.data.uuid;
            this.setState({ qr_code });
            this.setState({ uuid });
            this.props.varTeste(res.data.uuid);
        })
    }

    render() {
        const data = this.state.qr_code
        if (this.state.qr_code !== null) {
            const Example = ({ data }) => <img alt="description" src={`data:image/jpeg;base64,${data}`} />;
            return <div style={{textAlign: 'center'}}><Example data={data} /></div>
        }
        else {
            return <div style={{textAlign: 'center'}}>Aguarde, carregando QRCode...</div>
        }
        
    }
}