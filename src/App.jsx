import React from 'react'
import { Router } from '@reach/router'
import { ThemeProvider } from '@material-ui/styles'
import { Container, CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import Home from './containers/Home'
import TopBar from './containers/TopBar'
import { useFirebase } from './hooks/auth'
import AppContext from './contexts'

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

function App() {
  const appContext = {
    auth: useFirebase()
  }

  return (
    <AppContext.Provider value={appContext}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopBar />
        <Container maxWidth="md">
          <Router>
            <Home path="/" />
          </Router>
        </Container>
      </ThemeProvider>
    </AppContext.Provider>
  )
}

export default App
