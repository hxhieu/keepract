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
import * as str2ab from 'string-to-arraybuffer'
import { v4 } from 'uuid'
import { IProject } from '../types'
import { Credentials, ProtectedValue, Kdbx } from 'kdbxweb'

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
  onClose
}: {
  project: IProject
  open: boolean
  onClose: () => void
}) => {
  const classes = useStyles()
  const [database, setDatabase] = useState<ArrayBuffer>(new ArrayBuffer(0))

  useEffect(() => {
    const { kdbxFileId: fileId } = project
    if (!fileId) return
    const fetchFile = async () => {
      const response = await gapi.client.drive.files.get({
        fileId,
        alt: 'media'
      })
      const db = str2ab(response.body)
      const key = str2ab(project.keyFile)

      const cred = new Credentials(ProtectedValue.fromString(''), key)
      Kdbx.load(db, cred)
        .then(test => {
          console.log(test.meta)
        })
        .catch(err => console.log(err))
    }
    fetchFile()

    // request
    //   .on('end', function() {
    //     console.log('Done')
    //   })
    //   .on('error', (err: any) => {
    //     console.log('Error during download', err)
    //   })
  }, [project])

  return (
    <Dialog fullScreen open={open}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {project.name}
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
      <Container maxWidth="md">AAA</Container>
    </Dialog>
  )
}
