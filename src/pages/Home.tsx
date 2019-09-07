import React from 'react'
import ProjectList from '../containers/ProjectList'
import { useAuthContext } from '../contexts/auth'
import PageHeader from '../styled/PageHeader'
import { Button } from '@material-ui/core'
import { login } from '../containers/Firebase'

export default () => {
  const {
    auth: { accessToken }
  } = useAuthContext()

  return accessToken ? (
    <ProjectList />
  ) : (
    <>
      <PageHeader>Welcome to Keepract</PageHeader>
      <Button variant="contained" color="primary" onClick={login}>
        Login
      </Button>
    </>
  )
}
