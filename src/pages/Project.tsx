import { FC } from 'react'
import PageHeader from '../components/common/PageHeader'
import ProjectForm from '../components/ProjectForm'
import { IProject } from '../types'

const Project: FC = () => {
  const projectId = ''
  const onSave = (project: IProject) => {
    console.log(project)
  }
  const onDelete = (uuid: string) => {
    console.log(uuid)
  }
  return (
    <>
      <PageHeader title={projectId ? 'Edit Project' : 'Create Project'} />
      <ProjectForm onSave={onSave} onDelete={onDelete} />
    </>
  )
}

export default Project
