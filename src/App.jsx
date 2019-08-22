import React from 'react'
import { Router } from '@reach/router'
import { ThemeProvider } from '@material-ui/styles'
import { Container, CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import Login from './containers/Login'
import Home from './containers/Home'

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Router>
          <Home path="/" />
          <Login path="/login" />
        </Router>
      </Container>
    </ThemeProvider>
  )
}

export default App
