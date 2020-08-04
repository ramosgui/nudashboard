import React, { Component } from "react";
import axios from 'axios'
import QrCode from './qrCodeComponent';


class PasswordShowHide extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: true,
            cpf: "",
            password: "",

            showQrCode: false,
            uuid: 'uuid'

        };

        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleCpfChange = this.handleCpfChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleShow = this.toggleShow.bind(this);
        this.testeConst = this.testeConst.bind(this);

        this.toggleShowQrCode = this.toggleShowQrCode.bind(this);
    }

    testeConst(e) {
        this.setState({ uuid: e })
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    handleCpfChange(e) {
        this.setState({ cpf: e.target.value });
    }

    toggleShow() {
        this.setState({ hidden: !this.state.hidden });
    }

    toggleShowQrCode() {
        this.setState({ showQrCode: true });
    }

    handleSubmit(event) {
        event.preventDefault();
        //console.log('CPF: ' + this.state.cpf, ' Password: ' + this.state.password + ' UUID: ' + this.state.uuid)
        axios.post('http://localhost:5050/sync', { 'cpf': this.state.cpf, 'password': this.state.password, 'qr_uuid': this.state.uuid}).then(res => {
            const data = res.data;
            console.log(data)
            // this.setState({ qr_code });

        });


    }

    render() {

        if (this.state.showQrCode) {
            var modalContent = <><QrCode varTeste={this.testeConst} /> <input type="submit" value="Enviar" /></>
        } else {
            modalContent = <>
                <label>
                    CPF:
                    <input
                        type='text'
                        value={this.state.cpf}
                        onChange={this.handleCpfChange}
                    />
                </label>
                <label>
                    Pass:
                    <input
                        type={this.state.hidden ? "password" : "text"}
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                    />
                </label>

                <button onClick={this.toggleShowQrCode}>Continuar</button>
            </>
        }


        return (
            <form onSubmit={this.handleSubmit}>
                {modalContent}
            </form>

        );
    }
}

export default PasswordShowHide;