import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../contexts'

export default () => {
  const { accessToken } = useAuthContext()
  const [files, setFiles] = useState([])
  useEffect(() => {
    if (!accessToken) {
      setFiles([])
      return
    }
    const options = {
      pageSize: 10,
      fields: 'files(id, name, webContentLink)'
    }
    const fetchFiles = async () => {
      const response = await window.gapi.client.drive.files.list(options)
      setFiles(response.result.files || [])
    }
    fetchFiles()
  }, [accessToken])

  console.log(files)

  return (
    <>
      <h1>Home</h1>
    </>
  )
}
