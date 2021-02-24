import React, { FC } from 'react'
import { useRecoilValue } from 'recoil'
import { useHistory } from 'react-router-dom'
import { Button, List, Tag } from 'antd'
import { PlusOutlined, FolderOpenTwoTone } from '@ant-design/icons'
import styled from '@emotion/styled'
import ProjectEmpty from '../components/ProjectEmpty'
import PageHeader from '../components/common/PageHeader'
import { projectListState } from '../state/project'

const Buttons = styled.div`
  margin-top: 20px;
  text-align: center;
`

const UuidTag = styled(Tag)`
  opacity: 0.4;
`

const ListWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
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
          <ListWrapper>
            <List
              bordered
              dataSource={projects}
              renderItem={({ name, uuid, kdbxName }) => (
                <List.Item
                  actions={[
                    <Button
                      type="default"
                      onClick={() => push(`/project/${uuid}/group`)}
                      icon={<FolderOpenTwoTone />}
                    >
                      Open
                    </Button>,
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
          </ListWrapper>
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
