import React, { FC, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import { useProjects } from '../hooks/useProject'
import {
  currentProjectState,
  projectGroupState,
  projectListState,
} from '../state/project'
import { ProjectInfo } from '../types'
import KdbxGroup from '../components/kdbx/KdbxGroup'

interface ProjectGroupRouteParams {
  uuid?: string
}

const ProjectGroup: FC = () => {
  const currentProjectId = useRecoilValue(currentProjectState)
  const projects = useRecoilValue(projectListState)
  const group = useRecoilValue(projectGroupState)
  const [project, setProject] = useState<ProjectInfo>()
  const { fetchProject } = useProjects()
  const { uuid } = useParams<ProjectGroupRouteParams>()

  // Load project
  useEffect(() => {
    setProject(projects.find((x) => x.uuid === uuid))
  }, [projects])

  // Load KDBX groups
  useEffect(() => {
    if (!!uuid && uuid !== currentProjectId && project) {
      fetchProject(project)
    }
  }, [currentProjectId, uuid, project])

  return (
    <>
      <PageHeader title={`${project && project.name} Database`} />
      {/* Root group */}
      {group && <KdbxGroup group={group} />}
    </>
  )
}

export default ProjectGroup
