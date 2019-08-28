import React, { useReducer } from 'react'
import { Router } from '@reach/router'
import { ThemeProvider } from '@material-ui/styles'
import { Container, CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import Home from './pages/Home'
import TopBar from './containers/TopBar'
import Alert from './containers/Alert'
import { useFirebase } from './hooks/auth'
import AppContext from './contexts'
import AlertContext, { initialAlert } from './contexts/alert'
import alertReducer from './reducers/alertReducer'

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

function App() {
  const appContext = {
    auth: useFirebase()
  }

  const [alert, alertDispatch] = useReducer(alertReducer, initialAlert)

  return (
    <AlertContext.Provider value={{ alert, dispatch: alertDispatch }}>
      <AppContext.Provider value={appContext}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TopBar />
          <Container maxWidth="md">
            <Router>
              <Home path="/" />
            </Router>
          </Container>
          <Alert />
        </ThemeProvider>
      </AppContext.Provider>
    </AlertContext.Provider>
  )
}

export default App
