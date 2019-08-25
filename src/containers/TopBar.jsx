import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import { navigate } from '@reach/router'
import { useAuthContext, login, logout } from '../hooks/auth'

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
  const { initialising, user } = useAuthContext()

  const gotoHome = () => {
    navigate('/')
  }

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
