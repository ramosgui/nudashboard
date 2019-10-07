import React from 'react'
import ReactDOM from 'react-dom'
import CountUp from 'react-countup';

import PrimeiraReq from './components/FirstRequest'


const elemento = document.getElementById('root')
ReactDOM.render(
    <>
    <div><CountUp end={100} /></div>
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