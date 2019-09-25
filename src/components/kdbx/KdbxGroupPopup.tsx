import React from 'react'
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
import { Group } from 'kdbxweb'
import KdbxGroup from './KdbxGroup'
import ScreenLoader from '../common/ScreenLoader'

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}))

export default ({
  group,
  open,
  onClose
}: {
  group?: Group
  open: boolean
  onClose: () => void
}) => {
  const classes = useStyles()

  return (
    <Dialog fullScreen open={open}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {group && group.name}
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
        {group ? <KdbxGroup group={group} /> : <ScreenLoader loading={true} />}
      </Container>
    </Dialog>
  )
}
