import React, { FC, useState } from 'react'
import { useRecoilState } from 'recoil'
import { message } from 'antd'
import PageHeader from '../components/common/PageHeader'
import ProjectForm from '../components/ProjectForm'
import { IProject } from '../types'
import { getStorage } from '../storage'
import produce from 'immer'
import { projectListState } from '../state/project'

const Project: FC = () => {
  const storage = getStorage('project')

  const [project, setProject] = useState<IProject>()
  const [projects, setProjects] = useRecoilState(projectListState)

  const onSave = async (project: IProject) => {
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

    await storage.setItem(project.uuid as string, project)

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
  }

  const onDelete = (uuid: string) => {
    console.log(uuid)
  }

  return (
    <>
      <PageHeader title={project ? 'Edit Project' : 'Create Project'} />
      <ProjectForm onSave={onSave} onDelete={onDelete} project={project} />
    </>
  )
}

export default Project
