import React, { useState, useEffect } from 'react'
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  List,
  Box,
  CircularProgress
} from '@material-ui/core'
import StorageIcon from '@material-ui/icons/Storage'
import styled from '@emotion/styled'
import { useAuthContext } from '../contexts/auth'

const Container = styled(Box)({
  textAlign: 'center'
})

const Loader = styled(CircularProgress)`
  margin-top: 20px;
`

const ErrorMessage = styled.label({
  display: 'block',
  margin: '20px'
})

export default ({
  onSelect
}: {
  onSelect: (name: string, id: string) => void
}) => {
  const { auth } = useAuthContext()
  const { accessToken } = auth
  const [files, setFiles] = useState([] as gapi.client.drive.File[])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
          setError('Your token is expired, please relog')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchFiles()
  }, [accessToken])

  return (
    <Container>
      {loading && <Loader size={70} />}
      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <List>
          {files.map(({ id, name }) => (
            <ListItem
              button
              key={id}
              onClick={() => onSelect(name || '', id || '')}
            >
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  )
}
