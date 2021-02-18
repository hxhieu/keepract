import React, { useState, useEffect, FC } from 'react'
import {
  ToolTwoTone,
  ReloadOutlined,
  TagTwoTone,
  DatabaseTwoTone,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  Form,
  Input,
  Button,
  Modal,
  Radio,
  RadioChangeEvent,
  Upload,
  Result,
} from 'antd'
import styled from '@emotion/styled'
import * as ab2str from 'arraybuffer-to-string'
import { nanoid } from 'nanoid'
import GDriveFile from './GDriveFile'
import { CredType, IProject } from '../types'
import { primaryColour } from '../styles'

interface ProjectFormProps {
  project?: IProject
  onSave: (project: IProject) => void
  onDelete: (uuid: string) => void
}

const suffixButtonStyle = `
  font-size: 1.25rem;
  &:hover {
    color: ${primaryColour};
  }
`

const Wrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
`

const GenerateUuidButton = styled(ReloadOutlined)`
  ${suffixButtonStyle}
`

const DownloadKdbxButton = styled(DownloadOutlined)`
  ${suffixButtonStyle}
`

const KeyFileUpload = styled(Upload)`
  display: block;
`

const RadioGroup = styled.div`
  .ant-form-item {
    margin-bottom: 10px;
  }
`

const ProjectForm: FC<ProjectFormProps> = ({ project, onSave, onDelete }) => {
  const [form] = Form.useForm<IProject>()
  const intialValues = {
    ...project,
    uuid: (project && project.uuid) || nanoid(),
    credType: (project && project.credType) || 'keyfile',
  }
  const [openFile, setOpenFile] = useState<boolean>(false)
  const [credType, setCredType] = useState<CredType>(intialValues.credType)

  const refreshUuid = () => {
    form.setFields([{ name: 'uuid', value: nanoid() }])
  }

  const closeBrowsePopup = () => {
    setOpenFile(false)
  }

  const showBrowsePopup = () => {
    setOpenFile(true)
  }

  const credTypeChanged = (e: RadioChangeEvent) => {
    const value: CredType = e.target.value
    setCredType(value)
    form.setFields([
      {
        name: 'credType',
        value,
      },
    ])
  }

  const selectKdbx = (name?: string, id?: string, url?: string) => {
    form.setFields([
      {
        name: 'kdbxName',
        value: name,
      },
      {
        name: 'kdbxFileId',
        value: id,
      },
    ])
    closeBrowsePopup()
  }

  const beforeKeyUploade = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const blob = reader.result as string
      form.setFields([
        {
          name: 'keyFile',
          value: btoa(blob),
        },
      ])
    }
    reader.readAsText(file)
    return false
  }

  return (
    <Wrapper>
      <Form
        form={form}
        size="large"
        initialValues={intialValues}
        layout="vertical"
        onFinish={onSave}
      >
        <Form.Item label="UUID" name="uuid" rules={[{ required: true }]}>
          <Input
            prefix={<ToolTwoTone />}
            suffix={!project && <GenerateUuidButton onClick={refreshUuid} />}
            disabled
          />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Project name is required' }]}
        >
          <Input prefix={<TagTwoTone />} />
        </Form.Item>
        <Form.Item
          label="KDBX"
          name="kdbxName"
          rules={[{ required: true, message: 'The database is required' }]}
        >
          <Input
            prefix={<DatabaseTwoTone />}
            suffix={<DownloadKdbxButton onClick={showBrowsePopup} />}
            disabled
          />
        </Form.Item>
        <RadioGroup>
          <Form.Item
            name="credType"
            rules={[
              {
                required: true,
                message: 'The database credential is required',
              },
            ]}
          >
            <Radio.Group value={credType} onChange={credTypeChanged}>
              <Radio value="keyfile">Key file</Radio>
              <Radio value="password">Master password</Radio>
              <Radio value="none">Set later</Radio>
            </Radio.Group>
          </Form.Item>
        </RadioGroup>
        <Form.Item hidden={credType !== 'keyfile'}>
          <KeyFileUpload beforeUpload={beforeKeyUploade} accept=".key">
            <Button icon={<UploadOutlined />}>Upload key file</Button>
          </KeyFileUpload>
        </Form.Item>
        <Form.Item hidden={credType !== 'password'} name="password">
          <Input type="password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Save
          </Button>
        </Form.Item>
        <Form.Item hidden name="kdbxFileId">
          <></>
        </Form.Item>
        <Form.Item hidden name="keyFile">
          <></>
        </Form.Item>
      </Form>
      <Modal
        title="Select a database"
        visible={openFile}
        footer={false}
        onCancel={closeBrowsePopup}
      >
        <GDriveFile onSelect={selectKdbx} />
      </Modal>
    </Wrapper>
  )
}

export default ProjectForm
