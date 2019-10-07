import React from 'react'
import ReactDOM from 'react-dom'

import PrimeiraReq from './components/FirstRequest'
import FirstNumber from './components/FirstNumber';


const elemento = document.getElementById('root')
ReactDOM.render(
    <>
    <div><FirstNumber /></div>
    <table>
        <thead>
            <th>ID</th>
            <th>Descrição</th>
            <th>Criado em</th>
            <th>Valor</th>
            <th>Título</th>
        </thead>
        <tbody>
            <PrimeiraReq />
        </tbody>
    </table>
    </>
, elemento)