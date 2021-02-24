import React, { FC } from 'react'
import { Breadcrumb } from 'antd'
import { GROUP_IDS_SEPARATOR, KdbxItem, ProjectInfo } from '../types'
import { Link, useRouteMatch } from 'react-router-dom'

interface KdbxGroupBreadcrumbProps {
  project?: ProjectInfo
  loadedGroups: KdbxItem[]
  entry?: KdbxItem
}

const KdbxGroupBreadcrumb: FC<KdbxGroupBreadcrumbProps> = ({
  project,
  loadedGroups,
  entry,
}) => {
  const { url } = useRouteMatch()
  const renderBreadcrumb = (item: KdbxItem, idx: number) => {
    const currentPath = loadedGroups
      .slice(0, idx + 1)
      .map((p) => btoa(p.uuid || ''))
      .join(GROUP_IDS_SEPARATOR)
    return (
      <Breadcrumb.Item key={item.uuid}>
        <Link to={`/project/${project?.uuid}/group/${currentPath}`}>
          {item.name}
        </Link>
      </Breadcrumb.Item>
    )
  }

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={`/project/${project?.uuid}/group`}>{project?.name}</Link>
        </Breadcrumb.Item>
        {loadedGroups.map(renderBreadcrumb)}
        {entry && (
          <Breadcrumb.Item>
            <Link to={url}>{entry.name}</Link>
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
    </>
  )
}

export default KdbxGroupBreadcrumb
