import React, { useEffect } from 'react'
import { Link } from '@reach/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'firebase/app'

export default () => {
  const options = {
    pageSize: 10,
    fields: 'files(id, name, webContentLink)'
  }

  const [user, initialising] = useAuthState(firebase.auth())

  useEffect(() => {
    async function fetchData() {
      // const response = await window.gapi.client.drive.files.list(options)
      // console.log(response)
    }

    fetchData()
  })

  return (
    <>
      <h1>Home</h1>
      <Link to="/login">Hello page</Link>
    </>
  )
}
