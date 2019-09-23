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
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Input
} from '@material-ui/core'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import CloseIcon from '@material-ui/icons/Close'
import FingerprintIcon from '@material-ui/icons/Fingerprint'
import SubjectIcon from '@material-ui/icons/Subject'
import RefreshIcon from '@material-ui/icons/Refresh'
import DownloadIcon from '@material-ui/icons/GetApp'
import StorageIcon from '@material-ui/icons/Storage'
import KeyIcon from '@material-ui/icons/VpnKey'
import * as ab2str from 'arraybuffer-to-string'
import { v4 } from 'uuid'
import GDriveFile from './GDriveFile'
import { IProject } from '../types'

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
  },
  actions: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  credType: {
    flexDirection: 'row'
  },
  formControl: {
    margin: '16px 0 8px'
  },
  formLabel: {
    fontSize: '12px'
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
    kdbxFileId: '',
    kdbxName: '',
    credType: '',
    password: '',
    keyFile: ''
  })
  const [openFile, setOpenFile] = useState(false)
  const [fileId, setFileId] = useState('')

  useEffect(() => {
    // Clear values on close
    setValues({
      uuid: open ? (project && project.uuid) || v4() : '',
      name: open ? (project && project.name) || '' : '',
      kdbxFileId: open ? (project && project.kdbxFileId) || '' : '',
      kdbxName: open ? (project && project.kdbxName) || '' : '',
      credType: open ? (project && project.credType) || '' : '',
      password: open ? (project && project.password) || '' : '',
      keyFile: open ? (project && project.keyFile) || '' : ''
    })
  }, [open, project])

  function onChange(key: string, evt: any | string) {
    let value = ''
    if (typeof evt === 'object') {
      // File upload
      if (evt.target.files) {
        const reader = new FileReader()
        reader.onloadend = () => {
          value = ab2str(reader.result)
          setValues({
            ...values,
            [key]: value
          })
        }
        reader.readAsArrayBuffer(evt.target.files[0])
      } else {
        value = evt.target.value
      }
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
          <ValidatorForm
            onSubmit={() => onSave({ ...values, kdbxFileId: fileId })}
          >
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
                      className={classes.clickable}
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
              onChange={evt => onChange('kdbxFileId', evt)}
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
                      className={classes.clickable}
                      onClick={() => setOpenFile(true)}
                    />
                  </InputAdornment>
                )
              }}
            />
            <FormControl className={classes.formControl} fullWidth>
              <FormLabel className={classes.formLabel}>
                Credentials Type
              </FormLabel>
              <RadioGroup
                aria-label="cred-type"
                className={classes.credType}
                name="credType"
                value={values.credType}
                onChange={evt => onChange('credType', evt)}
              >
                <FormControlLabel
                  value=""
                  control={<Radio />}
                  label="Set Later"
                />
                <FormControlLabel
                  value="key-file"
                  control={<Radio />}
                  label="Key File"
                />
                <FormControlLabel
                  value="password"
                  control={<Radio />}
                  label="Password"
                />
              </RadioGroup>
            </FormControl>
            {values.credType === 'key-file' && (
              <FormControl className={classes.formControl} fullWidth>
                <FormLabel className={classes.formLabel}>Key File</FormLabel>
                <Input
                  fullWidth
                  type="file"
                  onChange={evt => onChange('keyFile', evt)}
                ></Input>
              </FormControl>
            )}
            {values.credType === 'password' && (
              <TextValidator
                value={values.password}
                type="password"
                onChange={evt => onChange('password', evt)}
                errorMessages={['This field is required']}
                fullWidth
                label="Password"
                name="password"
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  )
                }}
              />
            )}
            <Box className={classes.actions}>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Box>
          </ValidatorForm>
        </Container>
      </Dialog>

      {/* GDrive dialog */}
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
          onSelect={(name: string, id: string, url?: string) => {
            onChange('kdbxName', name)
            // Dont know why but need separate state and cannot call onChange() twice
            setFileId(id || '')
          }}
        />
      </Dialog>
    </>
  )
}
