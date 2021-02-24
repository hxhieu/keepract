import { message } from 'antd'
import { Entry } from 'kdbxweb'
import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import PageHeader from '../components/common/PageHeader'
import KdbxEntryForm from '../components/KdbxEntryForm'
import KdbxGroupBreadcrumb from '../components/KdbxGroupBreadcrumb'
import { useLoadCurrentGroup, useLoadProject } from '../hooks'
import { currentProjectState } from '../state/project'
import { KdbxEntryRouteParams, KdbxItem } from '../types'
import { getKdbxFieldValue } from '../utils'

const KdbxEntry: FC = () => {
  const project = useRecoilValue(currentProjectState)

  const { entryId } = useParams<KdbxEntryRouteParams>()
  const realId = atob(entryId)

  const [entry, setEntry] = useState<Entry>()

  // Fetch and cache the project
  const loading = useLoadProject(message.error)
  // Load current group and breadcrumb
  const [items, loadedGroups, currentGroup] = useLoadCurrentGroup(message.error)

  useEffect(() => {
    if (currentGroup)
      setEntry(currentGroup.entries.find((x) => x.uuid.id === realId))
  }, [currentGroup])

  const breadcrumbEntry: KdbxItem | undefined = entry && {
    name: getKdbxFieldValue(entry.fields.Title),
    uuid: entry.uuid.id,
  }

  return (
    <>
      <PageHeader title={`Project: ${project && project.name}`} />
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
    </>
  )
}

export default KdbxEntry
