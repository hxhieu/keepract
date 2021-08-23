import { message, Skeleton } from 'antd'
import { KdbxEntry } from 'kdbxweb'
import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import styled from '@emotion/styled'
import PageHeader from '../components/common/PageHeader'
import KdbxEntryForm from '../components/KdbxEntryForm'
import KdbxGroupBreadcrumb from '../components/KdbxGroupBreadcrumb'
import { useLoadCurrentGroup, useLoadProject } from '../hooks'
import { currentProjectState } from '../state/project'
import { KdbxEntryRouteParams, KdbxItem } from '../types'
import { getKdbxFieldValue } from '../utils'

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const KdbxEntryPage: FC = () => {
  const project = useRecoilValue(currentProjectState)

  const { entryId } = useParams<KdbxEntryRouteParams>()
  const realId = atob(entryId)

  const [entry, setEntry] = useState<KdbxEntry>()

  // Fetch and cache the project
  const loading = useLoadProject(message.error)
  // Load current group and breadcrumb
  const [items, loadedGroups, currentGroup] = useLoadCurrentGroup(message.error)

  const breadcrumbEntry: KdbxItem | undefined = entry && {
    name: getKdbxFieldValue(entry.fields.get('Title')) || 'UNKNOWN',
    uuid: entry.uuid.id,
  }

  useEffect(() => {
    if (currentGroup)
      setEntry(currentGroup.entries.find((x) => x.uuid.id === realId))
  }, [currentGroup])

  const renderSkeleton = () => {
    return [1, 2].map((key) => <Skeleton active key={key} />)
  }

  return (
    <>
      <PageHeader title={`Project: ${project && project.name}`} />
      <Wrapper>
        {loading && renderSkeleton()}
        {entry && (
          <>
            <KdbxGroupBreadcrumb
              project={project}
              loadedGroups={loadedGroups}
              entry={breadcrumbEntry}
            />
            <KdbxEntryForm entry={entry} />
          </>
        )}
      </Wrapper>
    </>
  )
}

export default KdbxEntryPage
