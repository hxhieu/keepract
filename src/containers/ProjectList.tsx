import React, { useState, useEffect } from 'react'
import { CircularProgress } from '@material-ui/core'
import styled from '@emotion/styled'
import PageHeader from '../styled/PageHeader'
import ProjectEmpty from '../components/ProjectEmpty'
import ProjectForm from '../components/ProjectForm'
import { getStorage } from '../storage'

const Loader = styled.div({
  textAlign: 'center'
})

export default () => {
  const storage = getStorage('project')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [openProjectCreate, setOpenProjectCreate] = useState(false)

  useEffect(() => {
    const loadProjects = async () => {
      const keys = await storage.keys()
      setLoading(false)
    }
    loadProjects()
  }, [])

  function createProject() {
    setOpenProjectCreate(false)
  }

  return (
    <>
      <PageHeader>Projects</PageHeader>
      {loading ? (
        <Loader>
          <CircularProgress size={70} />
        </Loader>
      ) : projects.length ? (
        'aaa'
      ) : (
        <>
          <ProjectEmpty
            onCreate={() => setOpenProjectCreate(true)}
          ></ProjectEmpty>
          <ProjectForm
            project={undefined}
            open={openProjectCreate}
            onClose={() => setOpenProjectCreate(false)}
            onSave={createProject}
          ></ProjectForm>
        </>
      )}
    </>
  )
}
