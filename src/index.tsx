import React from 'react'
import ReactDOM from 'react-dom'
// import * as Sentry from '@sentry/browser'
import App from './App'
import * as serviceWorker from './serviceWorker'

// Sentry.init({
//   dsn: 'https://c2cd2cc2d5564941a2bddc86a9da9b60@sentry.io/1759677',
// })

// Load GAPI first
gapi.load('client', async () => {
  // Load more GAPI clients
  await gapi.client.load('drive', 'v3')
  ReactDOM.render(<App />, document.getElementById('root'))
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
