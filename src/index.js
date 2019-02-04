import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const init = [
    {name: 'Arto Hellas', number: '040-123456'},
    {name: 'Martti Tienari', number: '040-123456'},
    {name: 'Arto Järvinen', number: '040-123456'},
    {name: 'Lea Kutvonen', number: '040-123456'},
]

ReactDOM.render(<App init={init}/>, document.getElementById('root'))
