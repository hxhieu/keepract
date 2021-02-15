import React, { useState, useEffect, FC } from 'react'
import styled from '@emotion/styled'
import { produce } from 'immer'
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

const Buttons = styled.div({
  textAlign: 'center',
})

const ProjectList: FC = () => {
  const storage = getStorage('project')
  const [projects, setProjects] = useState<IProjectList>({
    list: [],
    loading: true,
  })
  const [projectForm, setProjectForm] = useState<IProjectForm>({
    project: undefined,
    open: false,
  })
  const [project, setProject] = useState<IProject | undefined>()

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
  }, [])

  function closeProjectForm() {
    setProjectForm({
      ...projectForm,
      project: undefined,
      open: false,
    })
  }
  async function saveProject(project: IProject) {
    await storage.setItem(project.uuid, project)
    // Mutate the state
    setProjects(
      produce(projects, (draft) => {
        const matchIdx = draft.list.findIndex((x) => x.uuid === project.uuid)
        if (matchIdx >= 0) {
          draft.list[matchIdx] = { ...project }
        } else {
          draft.list.push({ ...project })
        }
      })
    )
    closeProjectForm()
  }

  async function deleteProject(uuid?: string) {
    if (!uuid) return
    await storage.removeItem(uuid)
    // Mutate the state
    setProjects(
      produce(projects, (draft) => {
        const matchIdx = draft.list.findIndex((x) => x.uuid === uuid)
        if (matchIdx >= 0) {
          draft.list.splice(matchIdx, 1)
        }
      })
    )
    closeProjectForm()
  }

  function editProject(project: IProject) {
    setProjectForm({
      project,
      open: true,
    })
  }

  function loadProject(project: IProject) {
    if (!project.credType) {
      setProjectForm({
        project,
        open: true,
      })
    } else {
      setProject(project)
    }
  }

  const { loading, list } = projects

  return (
    <>
      <PageHeader>Projects</PageHeader>
      <ScreenLoader loading={loading} />
      {/* {list.length ? (
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
        onClose={closeProjectForm}
        onSave={saveProject}
        onDelete={deleteProject}
      ></ProjectForm>
      {project && (
        <ProjectDatabase
          project={project}
          onClose={() => setProject(undefined)}
        ></ProjectDatabase>
      )} */}
    </>
  )
}

export default ProjectList
