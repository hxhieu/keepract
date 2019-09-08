import React from 'react'
import ProjectList from '../containers/ProjectList'
import { useAuthContext } from '../contexts/auth'
import PageHeader from '../styled/PageHeader'

export default () => {
  const {
    auth: { accessToken }
  } = useAuthContext()

  return accessToken ? (
    <ProjectList />
  ) : (
    <PageHeader>Welcome to Keepract</PageHeader>
  )
}
