import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'firebase/app'
import { navigate } from '@reach/router'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}))

export default () => {
  const classes = useStyles()
  const [user, initialising] = useAuthState(firebase.auth())
  const provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly')
  const options = {
    pageSize: 10,
    fields: 'files(id, name, webContentLink)'
  }

  const login = () => {
    firebase.auth().signInWithRedirect(provider)
  }
  const logout = () => {
    firebase.auth().signOut()
  }
  const gotoHome = () => {
    navigate('/')
  }

  useEffect(() => {
    // async function getToken() {
    //   if (initialising || !user) return
    //   const { credential } = await user.reauthenticateWithRedirect(provider)
    //   // window.gapi.auth.setToken({
    //   //   access_token: token,
    //   //   expires_in: expirationTime,
    //   //   error: '',
    //   //   state: ''
    //   // })
    //   // const response = await window.gapi.client.drive.files.list(options)
    //   // console.log(response)
    //   console.log(credential)
    // }
    // getToken()
  })

  const renderLoading = () => <label>Loading...</label>
  const renderUser = user => {
    return (
      <>
        <Typography variant="body1" className={classes.title}>
          {user.email}
        </Typography>
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </>
    )
  }
  const renderLogin = () => (
    <Button color="inherit" onClick={login}>
      Login
    </Button>
  )

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={gotoHome}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Keepract
          </Typography>
          {initialising
            ? renderLoading()
            : user
            ? renderUser(user)
            : renderLogin()}
        </Toolbar>
      </AppBar>
    </div>
  )
}
