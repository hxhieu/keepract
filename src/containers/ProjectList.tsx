import React, { useState, useEffect } from 'react'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Chip
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import StorageIcon from '@material-ui/icons/Storage'
import styled from '@emotion/styled'
import ProjectEmpty from '../components/ProjectEmpty'
import ProjectForm from '../components/ProjectForm'
import ProjectDatabase from '../components/ProjectDatabase'
import { getStorage } from '../storage'
import { IProject } from '../types'
import PageHeader from '../components/common/PageHeader'
import ScreenLoader from '../components/common/ScreenLoader'

interface IProjectForm {
  project?: IProject
  open: boolean
}

interface IProjectList {
  list: IProject[]
  loading: boolean
}

interface IProjectDatabase {
  project?: IProject
  open: boolean
}

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
  const [projectDatabase, setProjectDatabase] = useState<IProjectDatabase>({
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

  function loadProject(project: IProject) {
    if (!project.credType) {
      setProjectForm({
        project,
        open: true
      })
    } else {
      setProjectDatabase({
        project,
        open: true
      })
    }
  }

  const { loading, list } = projects

  return (
    <>
      <PageHeader>Projects</PageHeader>
      <ScreenLoader loading={loading} />
      {list.length ? (
        <List>
          {list.map(x => (
            <ListItem button key={x.uuid} onClick={() => loadProject(x)}>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText
                primary={x.name}
                secondary={
                  !x.credType ? (
                    <Chip component="a" label="LOCKED" size="small"></Chip>
                  ) : (
                    'Click to open'
                  )
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  color="primary"
                  aria-label="delete"
                  onClick={() => editProject(x)}
                >
                  <EditIcon />
                </IconButton>
              </ListItemSecondaryAction>
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
        project={projectForm.project}
        open={projectForm.open}
        onClose={() =>
          setProjectForm({
            ...projectForm,
            open: false
          })
        }
        onSave={saveProject}
      ></ProjectForm>
      <ProjectDatabase
        project={projectDatabase.project}
        open={projectDatabase.open}
        onClose={() =>
          setProjectDatabase({
            ...projectDatabase,
            open: false
          })
        }
      ></ProjectDatabase>
    </>
  )
}
