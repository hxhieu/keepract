import React, { useState, useEffect } from 'react'
import {
  ListItem,
  ListItemText,
  List,
  Box,
  CircularProgress
} from '@material-ui/core'
import styled from '@emotion/styled'
import { useAlertContext } from '../contexts/alert'
import { useAuthContext } from '../contexts/auth'

const Container = styled(Box)({
  textAlign: 'center'
})

export default () => {
  const { auth } = useAuthContext()
  const { accessToken } = auth
  const [files, setFiles] = useState([] as gapi.client.drive.File[])
  const [loading, setLoading] = useState(false)
  const { dispatch } = useAlertContext()

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
        setLoading(true)
        const response = await gapi.client.drive.files.list(options)
        setFiles(response.result.files || ([] as gapi.client.drive.File[]))
      } catch (err) {
        // Token expired
        if (err.status && err.status > 400 && err.status < 500) {
          // logout()
        }
      } finally {
        setLoading(false)
      }
    }
    fetchFiles()
  }, [accessToken])

  const download = (link: string | undefined) => {
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
    <Container>
      {loading && <CircularProgress size={70} />}
      <List>
        {files.map(({ id, name, webContentLink }) => (
          <ListItem button key={id} onClick={() => download(webContentLink)}>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </Container>
  )
}