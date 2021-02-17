import React, { useState, useEffect, FC } from 'react'
import styled from '@emotion/styled'
import { Alert, List, Button } from 'antd'
import { useRecoilValue } from 'recoil'
import { accessTokenState } from '../state/shell'

interface GDriveFileProps {
  onSelect: (name?: string, id?: string, url?: string) => void
}

const Container = styled.div`
  text-align: center;
`

const GDriveFile: FC<GDriveFileProps> = ({ onSelect }) => {
  const accessToken = useRecoilValue(accessTokenState)
  const [files, setFiles] = useState<gapi.client.drive.File[]>([])
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
      q: `name contains '.kdbx'`,
    }
    const fetchFiles = async () => {
      try {
        setLoading(true)
        const response = await gapi.client.drive.files.list(options)
        setFiles(response.result.files || ([] as gapi.client.drive.File[]))
      } catch (err) {
        // Token expired
        if (err.status && err.status > 400 && err.status < 500) {
          setError('Your access has expired, please relog')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchFiles()
  }, [accessToken])

  return (
    <Container>
      {error ? (
        <Alert message={error} type="error" />
      ) : (
        <List
          loading={loading && { tip: 'Getting the databases list...' }}
          bordered
          dataSource={files}
          renderItem={({ name, id, webContentLink }) => (
            <List.Item
              actions={[
                <Button
                  type="default"
                  onClick={() => onSelect(name, id, webContentLink)}
                >
                  Select
                </Button>,
              ]}
            >
              {name}
            </List.Item>
          )}
        />
      )}
    </Container>
  )
}

export default GDriveFile
