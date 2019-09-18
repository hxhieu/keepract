import React, { useState, useEffect } from 'react'
import {
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button
} from '@material-ui/core'
import styled from '@emotion/styled'
import PageHeader from '../styled/PageHeader'
import ProjectEmpty from '../components/ProjectEmpty'
import ProjectForm from '../components/ProjectForm'
import { getStorage } from '../storage'
import { IProject } from '../types'

interface IProjectForm {
  project?: IProject
  open: boolean
}

interface IProjectList {
  list: IProject[]
  loading: boolean
}

const Loader = styled.div({
  textAlign: 'center'
})

const Buttons = styled.div({
  textAlign: 'center'
})

export default () => {
  const storage = getStorage('project')
  const [projects, setProjects] = useState<IProjectList>({
    list: [],
    loading: true
  })
  const [projectForm, setProjectForm] = useState<IProjectForm>({
    project: undefined,
    open: false
  })

  useEffect(() => {
    const loadProjects = async () => {
      const keys = await storage.keys()
      const projects: IProject[] = []
      for (const x of keys) {
        const project = (await storage.getItem(x)) as IProject
        if (project) projects.push(project)
      }

      setProjects({ list: projects, loading: false })
    }
    loadProjects()
  }, [storage])

  async function saveProject(project: IProject) {
    await storage.setItem(project.uuid, project)
    // Close the form
    setProjectForm({
      ...projectForm,
      open: false
    })
    const { list } = projects
    // Mutate the state
    const matchIdx = list.findIndex(x => x.uuid === project.uuid)
    if (matchIdx && matchIdx >= 0) {
      const allProjects = [...list]
      allProjects[matchIdx] = project
      setProjects({
        ...projects,
        list: allProjects
      })
    } else {
      setProjects({ ...projects, list: [...list, project] })
    }
  }

  function editProject(project: IProject) {
    setProjectForm({
      project,
      open: true
    })
  }

  const { loading, list } = projects
  const { project, open } = projectForm

  return (
    <>
      <PageHeader>Projects</PageHeader>
      {loading ? (
        <Loader>
          <CircularProgress size={70} />
        </Loader>
      ) : list.length ? (
        <List>
          {list.map(x => (
            <ListItem button key={x.uuid}>
              <ListItemText primary={x.name} onClick={() => editProject(x)} />
            </ListItem>
          ))}
        </List>
      ) : (
        <ProjectEmpty />
      )}
      <Buttons>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            setProjectForm({
              project: undefined,
              open: true
            })
          }
        >
          Create Project
        </Button>
      </Buttons>
      <ProjectForm
        project={project}
        open={open}
        onClose={() =>
          setProjectForm({
            ...projectForm,
            open: false
          })
        }
        onSave={saveProject}
      ></ProjectForm>
    </>
  )
}
