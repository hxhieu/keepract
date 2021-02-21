import { Entry, Group } from 'kdbxweb'
import React, { FC, useEffect, useState } from 'react'
import {
  Route,
  Switch,
  useParams,
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router-dom'
import { Button, List } from 'antd'
import {
  FolderOpenTwoTone,
  FolderTwoTone,
  LockTwoTone,
} from '@ant-design/icons'
import PageHeader from '../components/common/PageHeader'
import styled from '@emotion/styled'
import { useRecoilValue } from 'recoil'
import {
  currentProjectState,
  projectGroupState,
  projectListState,
} from '../state/project'
import { ProjectInfo } from '../types'
import { useProjects } from '../hooks/useProject'

interface KdbxGroupRouteParams {
  uuid?: string
  groupIds?: string
}

interface KdbxGroupRouteState {
  parent?: Group
}

interface KdbxItem {
  name: string
  notes?: string
  uuid?: string
  isGroup: boolean
}

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const KdbxGroup: FC = () => {
  const currentProjectId = useRecoilValue(currentProjectState)
  const projects = useRecoilValue(projectListState)
  const group = useRecoilValue(projectGroupState)

  const { uuid, groupIds } = useParams<KdbxGroupRouteParams>()
  const { url } = useRouteMatch()
  const { push } = useHistory()
  const { state } = useLocation<KdbxGroupRouteState>()
  const parent = state && state.parent

  const [items, setItems] = useState<KdbxItem[]>([])
  const [project, setProject] = useState<ProjectInfo>()

  const { fetchProject } = useProjects()

  console.log(groupIds)

  // Load project
  useEffect(() => {
    setProject(projects.find((x) => x.uuid === uuid))
  }, [projects])

  // Load root group
  useEffect(() => {
    if (!!uuid && uuid !== currentProjectId && project) {
      fetchProject(project)
    }
  }, [currentProjectId, uuid, project])

  useEffect(() => {
    if (!group) return
    const currentGroup = parent
      ? parent.groups.find((x) => x.uuid.id === uuid)
      : group
    console.log(currentGroup)
    const { groups, entries } = currentGroup || {}
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
  }, [group, parent])

  const handleOpen = (uuid?: string, isGroup?: boolean) => {
    if (isGroup) {
      push(`${url}/${uuid}`, {
        parent: group,
      })
    }
  }

  return (
    <>
      <PageHeader title={`Project: ${project && project.name}`} />
      <Wrapper>
        <List
          bordered
          dataSource={items}
          renderItem={({ name, uuid, isGroup, notes }) => (
            <List.Item
              actions={[
                <Button
                  type="default"
                  icon={<FolderOpenTwoTone />}
                  onClick={() => handleOpen(uuid, isGroup)}
                >
                  Open
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={isGroup ? <FolderTwoTone /> : <LockTwoTone />}
                description={notes}
                title={name}
              />
            </List.Item>
          )}
        />
      </Wrapper>
      {/* <Switch>
        <Route path={`${url}/:groupId`}>
          <KdbxGroup />
        </Route>
      </Switch> */}
    </>
  )
}

export default KdbxGroup
