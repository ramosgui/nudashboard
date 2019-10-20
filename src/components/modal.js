import React from 'react'
import axios from 'axios'


export default props => {
    const showHideClassName = props.show ? "modal display-block" : "modal display-none";

    const editTransactionDescription = a => {
        axios.post('http://localhost:5000/edit/transaction', { id: a.id, description: a.description }).then(props.handleClose())
    }

    const editTransactionsDescription = a => {
        axios.post('http://localhost:5000/edit/transactions', { old_description: a.old_description, description: a.description }).then(props.handleClose())
    }

    return (
        <div className={showHideClassName}>
            <section className="modal-main">

                <button onClick={e => { editTransactionDescription(props.line) }}>Alterar apenas a descrição desta compra</button> <br /><br />

                <button onClick={e => { editTransactionsDescription(props.line) }}>Alterar todas compras com a mesma descrição</button>


                <button onClick={props.handleClose}>close</button>
            </section>
        </div>
    );
}