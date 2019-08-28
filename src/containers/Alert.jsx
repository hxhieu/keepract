import React from 'react'
import { Snackbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { amber, green } from '@material-ui/core/colors'
import { useAlertContext } from '../contexts/alert'

const useStyle = makeStyles(theme => ({
  success: {
    color: green[600]
  },
  error: {
    color: theme.palette.error.dark
  },
  info: {
    color: theme.palette.primary.main
  },
  warning: {
    color: amber[700]
  }
}))

export default () => {
  const { alert, dispatch } = useAlertContext()
  const { type, message } = alert
  const classes = useStyle()

  function close() {
    dispatch({
      type: 'SHOW_ALERT',
      payload: {
        type: null
      }
    })
  }

  return (
    <Snackbar
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      className={classes[type]}
      open={!!type}
      message={<span>{message}</span>}
      onClose={close}
    />
  )
}
