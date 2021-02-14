import React, { useState } from 'react'
import { useAlertContext } from '../contexts/alert'

export default () => {
  const { alert, dispatch } = useAlertContext()
  const { type, message } = alert
  const [alertClass] = useState('info')
  // const { success, warning, error, info } = useStyle()

  // useEffect(() => {
  //   switch (type) {
  //     case 'success':
  //       setAlertClasss(success)
  //       break
  //     case 'warning':
  //       setAlertClasss(warning)
  //       break
  //     case 'error':
  //       setAlertClasss(error)
  //       break
  //     case 'info':
  //       setAlertClasss(info)
  //       break
  //   }
  // }, [error, info, success, type, warning])

  function close() {
    dispatch({
      type: 'SHOW_ALERT',
      payload: {
        type: null,
      },
    })
  }

  return (
    <div></div>
    // <Snackbar
    //   autoHideDuration={3000}
    //   anchorOrigin={{
    //     vertical: 'top',
    //     horizontal: 'center',
    //   }}
    //   className={alertClass}
    //   open={!!type}
    //   message={<span>{message}</span>}
    //   onClose={close}
    // />
  )
}
