import React, { useEffect, FC } from 'react'
import { useRecoilValue } from 'recoil'
import { useHistory } from 'react-router-dom'
import { Button, List, Tag } from 'antd'
import {
  PlusOutlined,
  FolderOpenTwoTone,
  ProjectTwoTone,
} from '@ant-design/icons'
import styled from '@emotion/styled'
import { produce } from 'immer'
import ProjectEmpty from '../components/ProjectEmpty'
import { getStorage } from '../storage'
import { ProjectInfo } from '../types'
import PageHeader from '../components/common/PageHeader'
import { projectListState } from '../state/project'

const Buttons = styled.div`
  margin-top: 20px;
  text-align: center;
`

const UuidTag = styled(Tag)`
  opacity: 0.4;
`

const ProjectIcon = styled(ProjectTwoTone)`
  font-size: 3rem;
`

const ProjectList: FC = () => {
  const { push } = useHistory()
  const projects = useRecoilValue(projectListState)

  const editProject = (uuid?: string) => {
    push(`/project/${uuid}`)
  }

  return (
    <>
      {projects.length > 0 ? (
        <>
          <PageHeader title="Projects" disableBack={true} />
          <List
            bordered
            dataSource={projects}
            renderItem={({ name, uuid, kdbxName }) => (
              <List.Item
                actions={[
                  <Button
                    type="default"
                    shape="circle"
                    onClick={() => push(`/project/${uuid}/entry`)}
                    icon={<FolderOpenTwoTone />}
                  ></Button>,
                  <Button
                    type="link"
                    shape="circle"
                    onClick={() => editProject(uuid)}
                  >
                    Edit
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={name}
                  description={<UuidTag>{kdbxName}</UuidTag>}
                />
              </List.Item>
            )}
          />
        </>
      ) : (
        <ProjectEmpty />
      )}
      <Buttons>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          size="large"
          onClick={() => push('/project')}
        >
          Create Project
        </Button>
      </Buttons>
    </>
  )
}

export default ProjectList
