import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Dialog,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Typography
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import * as str2ab from 'string-to-arraybuffer'
import { IProject } from '../types'
import { Credentials, Kdbx, Group } from 'kdbxweb'
import KdbxGroup from '../components/kdbx/KdbxGroup'
import ScreenLoader from './common/ScreenLoader'

interface IGroupList {
  list?: Group[]
  loading: boolean
}

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
  const [groups, setGroups] = useState<IGroupList>({
    loading: true,
    list: undefined
  })

  useEffect(() => {
    const { kdbxFileId: fileId } = project
    if (!fileId) return
    const fetchFile = async () => {
      const response = await gapi.client.drive.files.get({
        fileId,
        alt: 'media'
      })

      const dbBuff = str2ab(response.body)
      const keyBuff = str2ab(project.keyFile)

      const cred = new Credentials(null, keyBuff)
      Kdbx.load(dbBuff, cred)
        .then(db => {
          setGroups({
            loading: false,
            list: db.groups
          })
        })
        .catch(err => {
          console.log(err)
          setGroups({
            loading: false,
            list: undefined
          })
        })
    }
    fetchFile()
  }, [project])

  const { loading, list } = groups

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
      <Container maxWidth="md">
        <ScreenLoader loading={loading} />
        {list && list.length && <KdbxGroup group={list[0]} />}
      </Container>
    </Dialog>
  )
}
