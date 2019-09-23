import React from 'react'
import {
  Dialog,
  Toolbar,
  Typography,
  IconButton,
  AppBar,
  Container,
  makeStyles,
  InputAdornment
} from '@material-ui/core'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import SubjectIcon from '@material-ui/icons/Subject'
import CloseIcon from '@material-ui/icons/Close'
import CopyIcon from '@material-ui/icons/FileCopyOutlined'
import { Entry, ProtectedValue } from 'kdbxweb'
import ScreenLoader from '../common/ScreenLoader'

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  clickable: {
    color: '#aaa',
    cursor: 'pointer',
    '&:hover': {
      color: '#fff'
    }
  }
}))

const getValue = (value: any) => {
  if (value instanceof ProtectedValue) {
    return value.getText()
  } else {
    return value
  }
}

export default ({
  open,
  entry,
  onClose
}: {
  open: boolean
  entry?: Entry
  onClose: () => void
}) => {
  const classes = useStyles()

  return (
    <Dialog fullScreen open={open}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {entry && entry.fields.Title}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        {(entry && (
          <ValidatorForm onSubmit={() => {}}>
            {entry.fields &&
              Object.keys(entry.fields).map(x => {
                const value = entry.fields[x]
                const isPassword = value instanceof ProtectedValue
                return (
                  <TextValidator
                    type={isPassword ? 'password' : 'text'}
                    key={x}
                    value={getValue(value)}
                    validators={['required']}
                    errorMessages={['This field is required']}
                    fullWidth
                    label={x}
                    name={x}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SubjectIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="start">
                          <CopyIcon
                            className={classes.clickable}
                            onClick={() => {}}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                )
              })}
          </ValidatorForm>
        )) || <ScreenLoader loading={true} />}
      </Container>
    </Dialog>
  )
}
