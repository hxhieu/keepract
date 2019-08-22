import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import './firebase'

// Load GAPI first
window.gapi.load('client', async () => {
  // Load more GAPI clients
  await window.gapi.client.load('drive', 'v3')
  ReactDOM.render(<App />, document.getElementById('root'))
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
