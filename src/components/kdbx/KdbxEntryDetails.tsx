import React from 'react'
import { Entry, ProtectedValue } from 'kdbxweb'
import * as copy from 'copy-to-clipboard'
import ScreenLoader from '../common/ScreenLoader'

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
  onClose,
}: {
  open: boolean
  entry?: Entry
  onClose: () => void
}) => {
  return (
    <div></div>
    // <Dialog fullScreen open={open}>
    //   <AppBar className={classes.appBar}>
    //     <Toolbar>
    //       <Typography variant="h6" className={classes.title}>
    //         {entry && entry.fields.Title}
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
    //     {(entry && (
    //       <ValidatorForm onSubmit={() => {}}>
    //         {entry.fields &&
    //           Object.keys(entry.fields).map(x => {
    //             const value = entry.fields[x]
    //             const isPassword = value instanceof ProtectedValue
    //             return (
    //               <TextValidator
    //                 type={isPassword ? 'password' : 'text'}
    //                 key={x}
    //                 value={getValue(value)}
    //                 validators={['required']}
    //                 errorMessages={['This field is required']}
    //                 fullWidth
    //                 label={x}
    //                 name={x}
    //                 margin="normal"
    //                 InputProps={{
    //                   readOnly: true,
    //                   startAdornment: (
    //                     <InputAdornment position="start">
    //                       <SubjectIcon />
    //                     </InputAdornment>
    //                   ),
    //                   endAdornment: (
    //                     <InputAdornment position="start">
    //                       <CopyIcon
    //                         className={classes.clickable}
    //                         onClick={() => {
    //                           copy.default(getValue(value))
    //                           alert('Copied!')
    //                         }}
    //                       />
    //                     </InputAdornment>
    //                   )
    //                 }}
    //               />
    //             )
    //           })}
    //       </ValidatorForm>
    //     )) || <ScreenLoader loading={true} />}
    //   </Container>
    // </Dialog>
  )
}
