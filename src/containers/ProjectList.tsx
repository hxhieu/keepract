import React, { useState, useEffect } from 'react'
import { CircularProgress } from '@material-ui/core'
import styled from '@emotion/styled'
import PageHeader from '../styled/PageHeader'
import ProjectEmpty from '../components/ProjectEmpty'
import ProjectForm from '../components/ProjectForm'
import { getStorage } from '../storage'
import { IProject } from '../types'

const Loader = styled.div({
  textAlign: 'center'
})

export default () => {
  const storage = getStorage('project')
  const [projects, setProjects] = useState([])
  const [project, setProject] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [openProjectCreate, setOpenProjectCreate] = useState(false)

  useEffect(() => {
    const loadProjects = async () => {
      const keys = await storage.keys()
      setLoading(false)
    }
    loadProjects()
  }, [storage])

  function createProject(values: IProject) {
    console.log(values)
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
            project={project}
            open={openProjectCreate}
            onClose={() => setOpenProjectCreate(false)}
            onSave={createProject}
          ></ProjectForm>
        </>
      )}
    </>
  )
}
