import React, { FC } from 'react'
import { Breadcrumb } from 'antd'
import { GROUP_IDS_SEPARATOR, KdbxItem, ProjectInfo } from '../types'
import { Link } from 'react-router-dom'

interface KdbxGroupBreadcrumbProps {
  project?: ProjectInfo
  loadedGroups: KdbxItem[]
}

const KdbxGroupBreadcrumb: FC<KdbxGroupBreadcrumbProps> = ({
  project,
  loadedGroups,
}) => {
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
      </Breadcrumb>
    </>
  )
}

export default KdbxGroupBreadcrumb
