import React, { FC } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { List, message } from 'antd'
import { FolderTwoTone, LockTwoTone } from '@ant-design/icons'
import PageHeader from '../components/common/PageHeader'
import styled from '@emotion/styled'
import { useRecoilValue } from 'recoil'
import { currentProjectState } from '../state/project'
import { GROUP_IDS_SEPARATOR } from '../types'
import KdbxGroupBreadcrumb from '../components/KdbxGroupBreadcrumb'
import { primaryBg } from '../styles'
import { useLoadCurrentGroup, useLoadProject } from '../hooks'

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
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
      <Wrapper>
        <>
          <KdbxGroupBreadcrumb project={project} loadedGroups={loadedGroups} />
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
        </>
      </Wrapper>
    </>
  )
}

export default KdbxGroup
