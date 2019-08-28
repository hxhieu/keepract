import React, { useState, useEffect } from 'react'
import { ListItem, ListItemText, List } from '@material-ui/core'
import { useAuthContext } from '../contexts'
import { logout } from '../hooks/auth'
import { useAlert } from '../contexts/alert'

export default () => {
  const { accessToken } = useAuthContext()
  const [files, setFiles] = useState([])
  const { dispatch } = useAlert()

  useEffect(() => {
    if (!accessToken) {
      setFiles([])
      return
    }
    const options = {
      pageSize: 100,
      fields: 'files(id, name, webContentLink)',
      q: `name contains '.kdbx'`
    }
    const fetchFiles = async () => {
      try {
        const response = await window.gapi.client.drive.files.list(options)
        setFiles(response.result.files || [])
      } catch (err) {
        // Token expired
        if (err.status && err.status > 400 && err.status < 500) {
          logout()
        }
      }
    }
    fetchFiles()
  }, [accessToken])

  const download = link => {
    dispatch({
      type: 'SHOW_ALERT',
      payload: {
        type: 'success',
        message: 'Hello!'
      }
    })
    console.log(link)
  }

  return (
    <List>
      {files.map(({ id, name, webContentLink }) => (
        <ListItem button key={id} onClick={() => download(webContentLink)}>
          <ListItemText primary={name} />
        </ListItem>
      ))}
    </List>
  )
}
