import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../contexts'
import { ListItem, ListItemText, List } from '@material-ui/core'

export default () => {
  const { accessToken } = useAuthContext()
  const [files, setFiles] = useState([])
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
      const response = await window.gapi.client.drive.files.list(options)
      setFiles(response.result.files || [])
    }
    fetchFiles()
  }, [accessToken])

  const download = link => {
    console.log(link)
  }

  return (
    <>
      <h1>Home</h1>
      <List>
        {files.map(({ id, name, webContentLink }) => (
          <ListItem button key={id} onClick={() => download(webContentLink)}>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </>
  )
}
