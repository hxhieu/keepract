import React, { useReducer } from 'react'
import { Router } from '@reach/router'
import { ThemeProvider } from '@material-ui/styles'
import { Container, CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import Home from './pages/Home'
import TopBar from './containers/TopBar'
import Alert from './containers/Alert'
import Firebase from './containers/Firebase'
import AlertContext, { initialAlert } from './contexts/alert'
import alertReducer from './reducers/alertReducer'
import AuthContext, { initialAuth } from './contexts/auth'
import authReducer from './reducers/authReducer'

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

function App() {
  const [alert, alertDispatch] = useReducer(alertReducer, initialAlert)
  const [auth, authDispatch] = useReducer(authReducer, initialAuth)

  return (
    <AlertContext.Provider value={{ alert, dispatch: alertDispatch }}>
      <AuthContext.Provider value={{ auth, dispatch: authDispatch }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Firebase />
          <TopBar />
          <Container maxWidth="md">
            <Router>
              <Home path="/" />
            </Router>
          </Container>
          <Alert />
        </ThemeProvider>
      </AuthContext.Provider>
    </AlertContext.Provider>
  )
}

export default App
