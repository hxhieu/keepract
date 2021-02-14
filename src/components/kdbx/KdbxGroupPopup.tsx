import React from 'react'
import { Group } from 'kdbxweb'
import KdbxGroup from './KdbxGroup'
import ScreenLoader from '../common/ScreenLoader'

export default ({
  group,
  open,
  onClose,
}: {
  group?: Group
  open: boolean
  onClose: () => void
}) => {
  return (
    <div></div>
    // <Dialog fullScreen open={open}>
    //   <AppBar className={classes.appBar}>
    //     <Toolbar>
    //       <Typography variant="h6" className={classes.title}>
    //         {group && group.name}
    //       </Typography>
    //       <IconButton
    //         edge="start"
    //         color="inherit"
    //         aria-label="close"
    //         onClick={onClose}
    //       >
    //         <CloseIcon />
    //       </IconButton>
    //     </Toolbar>
    //   </AppBar>
    //   <Container maxWidth="md">
    //     {group ? <KdbxGroup group={group} /> : <ScreenLoader loading={true} />}
    //   </Container>
    // </Dialog>
  )
}
