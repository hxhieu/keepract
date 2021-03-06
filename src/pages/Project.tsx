import React, { FC, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { message } from 'antd'
import PageHeader from '../components/common/PageHeader'
import ProjectForm from '../components/ProjectForm'
import { ProjectInfo } from '../types'
import { getStorage } from '../storage'
import produce from 'immer'
import { projectListState } from '../state/project'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from '../containers/Firebase'

interface ProjectRouteParams {
  uuid?: string
}

const Project: FC = () => {
  const storage = getStorage('project')
  const [user] = useAuthState(getAuth())

  const { uuid } = useParams<ProjectRouteParams>()
  const { push } = useHistory()
  const [project, setProject] = useState<ProjectInfo>()
  const [projects, setProjects] = useRecoilState(projectListState)

  useEffect(() => {
    const editProject = projects.find((x) => x.uuid === uuid)
    if (editProject) {
      setProject(editProject)
    }
  }, [projects, uuid])

  const onSave = async (project: ProjectInfo) => {
    if (!user) {
      return message.error('Could not find your account details. Please relog.')
    }
    // Clean up extra details
    switch (project.credType) {
      case 'keyfile':
        delete project.password
        break
      case 'password':
        delete project.keyFile
        break
      default:
        delete project.keyFile
        delete project.password
        break
    }

    // Partition by user
    await storage.setItem(`${user.email}:${project.uuid}`, project)

    setProject(project)

    // Mutate the state
    setProjects(
      produce(projects, (draft) => {
        const matchIdx = draft.findIndex((x) => x.uuid === project.uuid)
        if (matchIdx >= 0) {
          draft[matchIdx] = { ...project }
        } else {
          draft.push({ ...project })
        }
      })
    )

    message.success({
      key: 'saveSuccessMsg',
      content: 'The Project has been saved successfully',
      onClick: () => message.destroy('saveSuccessMsg'),
      duration: 3,
    })

    backToList()
  }

  const onDelete = async (uuid?: string) => {
    if (!uuid) return
    await storage.removeItem(uuid)
    // Mutate the state
    setProjects(
      produce(projects, (draft) => {
        const matchIdx = draft.findIndex((x) => x.uuid === uuid)
        if (matchIdx >= 0) {
          draft.splice(matchIdx, 1)
        }
      })
    )
    message.success({
      key: 'saveDeleteMsg',
      content: 'The Project has been deleted',
      onClick: () => message.destroy('saveDeleteMsg'),
      duration: 3,
    })
    backToList()
  }

  const backToList = () => {
    push('/')
  }

  return (
    <>
      <PageHeader title={project ? `Edit ${project.name}` : 'Create Project'} />
      <ProjectForm
        onSave={onSave}
        onDelete={onDelete}
        onCancel={backToList}
        project={project}
      />
    </>
  )
}

export default Project
