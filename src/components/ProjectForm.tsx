import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Dialog,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputAdornment,
  Box,
  Button
} from '@material-ui/core'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import CloseIcon from '@material-ui/icons/Close'
import FingerprintIcon from '@material-ui/icons/Fingerprint'
import SubjectIcon from '@material-ui/icons/Subject'
import RefreshIcon from '@material-ui/icons/Refresh'
import DownloadIcon from '@material-ui/icons/GetApp'
import StorageIcon from '@material-ui/icons/Storage'
import { IProject } from '../types'
import { v4 } from 'uuid'
import GDriveFile from './GDriveFile'

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
    name: '',
    kdbxUrl: '',
    kdbxName: ''
  })
  const [openFile, setOpenFile] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    // Clear values on close
    setValues({
      uuid: open ? (project ? project.uuid : v4()) : '',
      name: open ? (project ? project.name : '') : '',
      kdbxUrl: open ? (project ? project.kdbxUrl || '' : '') : '',
      kdbxName: open ? (project ? project.kdbxName || '' : '') : ''
    })
  }, [open, project])

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

    if (key === 'kdbxName') setOpenFile(false)
  }

  return (
    <>
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
        <Container maxWidth="md">
          <ValidatorForm onSubmit={() => onSave({ ...values, kdbxUrl: url })}>
            <TextValidator
              value={values.uuid}
              validators={['required']}
              errorMessages={['This field is required']}
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
            <TextValidator
              value={values.kdbxName}
              onChange={evt => onChange('kdbxUrl', evt)}
              validators={['required']}
              errorMessages={['This field is required']}
              fullWidth
              label="KDBX"
              name="kdbxName"
              margin="normal"
              InputProps={{
                disabled: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <StorageIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                    <DownloadIcon
                      className={classes.idRefresh}
                      onClick={() => setOpenFile(true)}
                    />
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
      <Dialog open={openFile} fullWidth maxWidth="sm">
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Select a database
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="close"
              onClick={() => setOpenFile(false)}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <GDriveFile
          onSelect={(name: string | undefined, url: string | undefined) => {
            onChange('kdbxName', name)
            // Dont know why but need separate state and cannot call onChange() twice
            setUrl(url || '')
          }}
        />
      </Dialog>
    </>
  )
}
