import React, { FC, useEffect, useState } from 'react'
import { useParams, useRouteMatch, useHistory } from 'react-router-dom'
import { List, message } from 'antd'
import { FolderTwoTone, LockTwoTone } from '@ant-design/icons'
import PageHeader from '../components/common/PageHeader'
import styled from '@emotion/styled'
import { useRecoilValue } from 'recoil'
import {
  currentProjectState,
  projectGroupState,
  projectListState,
} from '../state/project'
import { GROUP_IDS_SEPARATOR, KdbxItem, ProjectInfo } from '../types'
import { useProjects } from '../hooks/useProject'
import KdbxGroupBreadcrumb from '../components/KdbxGroupBreadcrumb'
import { primaryBg } from '../styles'
import { Group } from 'kdbxweb'

interface KdbxGroupRouteParams {
  uuid: string
  groupIds?: string
}

const Wrapper = styled.div`
  max-width: 800px;
  margin: 10px auto;
  li.ant-list-item {
    cursor: pointer;
    &:hover {
      background: ${primaryBg};
    }
  }
`

const KdbxGroup: FC = () => {
  const currentProjectId = useRecoilValue(currentProjectState)
  const projects = useRecoilValue(projectListState)
  const group = useRecoilValue(projectGroupState)

  const { uuid, groupIds } = useParams<KdbxGroupRouteParams>()
  const { url } = useRouteMatch()
  const { push } = useHistory()

  const [items, setItems] = useState<KdbxItem[]>([])
  const [project, setProject] = useState<ProjectInfo>()
  const [loading, setLoading] = useState(false)
  const [loadedGroups, setLoadedGroups] = useState<KdbxItem[]>([])

  const { fetchProject } = useProjects()

  const allGroups = (groupIds
    ? groupIds.split(GROUP_IDS_SEPARATOR)
    : []
  ).map((x) => atob(x))

  // Load project
  useEffect(() => {
    setProject(projects.find((x) => x.uuid === uuid))
  }, [projects])

  // Load root group
  useEffect(() => {
    if (!!uuid && uuid !== currentProjectId && project) {
      setLoading(true)
      fetchProject(project).finally(() => {
        setLoading(false)
      })
    }
  }, [currentProjectId, uuid, project])

  useEffect(() => {
    if (!group) return

    let currentGroup: Group = group
    let groupLevel = 0
    const tempGroups: KdbxItem[] = []

    // Read all groups in the path
    while (groupLevel < allGroups.length) {
      const nextId = allGroups[groupLevel]
      const found = currentGroup.groups.find((x) => x.uuid.id === nextId)
      if (found) {
        currentGroup = found
        tempGroups.push({
          name: found.name.toString(),
          uuid: found.uuid.id,
          isGroup: true,
        })
      } else {
        // Groups not in valid sequence
        // then we stop the process
        message.error(`Could not open the group id: ${nextId}`)
        break
      }
      groupLevel++
    }

    // For breadcrumb
    setLoadedGroups(tempGroups)

    const { groups, entries } = currentGroup

    const temp: KdbxItem[] = []
    if (groups)
      groups.forEach((x) => {
        temp.push({
          name: x.name as string,
          uuid: x.uuid.id,
          isGroup: true,
        })
      })
    if (entries)
      entries.forEach((x) => {
        const { fields, uuid } = x
        const { Title, Notes } = fields
        temp.push({
          name: Title as string,
          notes: Notes as string,
          uuid: uuid.id,
          isGroup: false,
        })
      })
    setItems(temp)
  }, [group, url])

  const handleOpen = (uuid?: string, isGroup?: boolean) => {
    let nextUrl = url
    const safeId = btoa(uuid || '')
    if (isGroup) {
      if (allGroups.length === 0) {
        nextUrl += `/${safeId}`
      } else {
        nextUrl += `${GROUP_IDS_SEPARATOR}${safeId}`
      }
    } else {
      nextUrl += `/entry/${safeId}`
    }
    push(nextUrl)
  }

  return (
    <>
      <PageHeader title={`Project: ${project && project.name}`} />
      <KdbxGroupBreadcrumb project={project} loadedGroups={loadedGroups} />
      <Wrapper>
        <List
          bordered
          loading={loading && { tip: 'Getting the databases...' }}
          dataSource={items}
          renderItem={({ name, uuid, isGroup, notes }) => (
            <List.Item onClick={() => handleOpen(uuid, isGroup)}>
              <List.Item.Meta
                avatar={isGroup ? <FolderTwoTone /> : <LockTwoTone />}
                description={notes}
                title={name}
              />
            </List.Item>
          )}
        />
      </Wrapper>
    </>
  )
}

export default KdbxGroup
