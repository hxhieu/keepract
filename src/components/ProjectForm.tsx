import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Dialog,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Box,
  Button
} from '@material-ui/core'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import CloseIcon from '@material-ui/icons/Close'
import FingerprintIcon from '@material-ui/icons/Fingerprint'
import SubjectIcon from '@material-ui/icons/Subject'
import RefreshIcon from '@material-ui/icons/Refresh'
import { IProject } from '../types'
import { v4 } from 'uuid'

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  idRefresh: {
    cursor: 'pointer',
    '&:hover': {
      color: '#fff'
    }
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}))

export default ({
  project,
  open,
  onClose,
  onSave
}: {
  project?: IProject
  open: boolean
  onClose: () => void
  onSave: (values: IProject) => void
}) => {
  const classes = useStyles()
  const [values, setValues] = useState({
    uuid: '',
    name: ''
  })

  useEffect(() => {
    // Clear values on close
    setValues({
      uuid: open ? (project ? project.uuid : v4()) : '',
      name: open ? (project ? project.name : '') : ''
    })
  }, [open])

  function onChange(key: string, evt: any | string) {
    let value = ''
    if (typeof evt === 'object') {
      value = evt.target.value
    } else {
      value = evt
    }

    setValues({
      ...values,
      [key]: value
    })
  }

  return (
    <Dialog fullScreen open={open}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {project ? 'Edit Project' : 'Create Project'}
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
      <Container maxWidth="sm">
        <ValidatorForm onSubmit={() => onSave(values)}>
          <TextField
            value={values.uuid}
            required
            fullWidth
            label="ID"
            name="uuid"
            margin="normal"
            InputProps={{
              disabled: true,
              startAdornment: (
                <InputAdornment position="start">
                  <FingerprintIcon />
                </InputAdornment>
              ),
              endAdornment: !project && (
                <InputAdornment position="start">
                  <RefreshIcon
                    className={classes.idRefresh}
                    onClick={() => onChange('uuid', v4())}
                  />
                </InputAdornment>
              )
            }}
          />
          <TextValidator
            value={values.name}
            onChange={evt => onChange('name', evt)}
            validators={['required']}
            errorMessages={['This field is required']}
            fullWidth
            label="Name"
            name="name"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SubjectIcon />
                </InputAdornment>
              )
            }}
          />
          <Box className={classes.actions}>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </Box>
        </ValidatorForm>
      </Container>
    </Dialog>
  )
}
