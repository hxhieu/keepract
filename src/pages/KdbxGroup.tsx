import React, { FC, useEffect, useState } from 'react'
import { useParams, useRouteMatch, useHistory } from 'react-router-dom'
import { List, message } from 'antd'
import { FolderTwoTone, LockTwoTone } from '@ant-design/icons'
import PageHeader from '../components/common/PageHeader'
import styled from '@emotion/styled'
import { useRecoilValue } from 'recoil'
import {
  cachedProjectState,
  currentProjectState,
  projectGroupState,
  projectListState,
} from '../state/project'
import { GROUP_IDS_SEPARATOR, KdbxItem, ProjectInfo } from '../types'
import { useProjects } from '../hooks/useProject'
import KdbxGroupBreadcrumb from '../components/KdbxGroupBreadcrumb'
import { primaryBg } from '../styles'

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
  const project = useRecoilValue(currentProjectState)

  const { url } = useRouteMatch()
  const { push } = useHistory()

  const { useLoadProject, useLoadCurrentGroup } = useProjects()
  // Fetch and cache the project
  const loading = useLoadProject(message.error)
  // Load current group and breadcrumb
  const [items, loadedGroups] = useLoadCurrentGroup(message.error)

  const handleOpen = (uuid?: string, isGroup?: boolean) => {
    let nextUrl = url
    const safeId = btoa(uuid || '')
    if (isGroup) {
      if (loadedGroups.length === 0) {
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
