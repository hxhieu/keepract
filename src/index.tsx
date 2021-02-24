import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
// import * as Sentry from '@sentry/browser'
import App from './App'

// Sentry.init({
//   dsn: 'https://c2cd2cc2d5564941a2bddc86a9da9b60@sentry.io/1759677',
// })

// Load GAPI first
gapi.load('client', async () => {
  // Load more GAPI clients
  await gapi.client.load('drive', 'v3')
  ReactDOM.render(
    <RecoilRoot>
      <App />
    </RecoilRoot>,
    document.getElementById('root')
  )
})
