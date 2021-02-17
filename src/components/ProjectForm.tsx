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

const CredTypeSuppliment = styled.div`
  margin-top: 10px;
`

const KeyFileUpload = styled(Upload)`
  display: block;
`

const VerticalRadio = styled(Radio)`
  display: block;
  height: 30px;
  line-height: 30px;
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
    const value = e.target.value
    setCredType(value)
    form.setFields([
      {
        name: 'credType',
        value,
      },
    ])
  }

  const beforeKeyUploade = (file: File) => {
    console.log(file)
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
        <Form.Item
          name="credType"
          rules={[
            { required: true, message: 'The database credential is required' },
          ]}
        >
          <>
            <Radio.Group value={credType} onChange={credTypeChanged}>
              <VerticalRadio value="keyfile">Key file</VerticalRadio>
              <VerticalRadio value="password">Master password</VerticalRadio>
              <VerticalRadio value="none">Set later</VerticalRadio>
            </Radio.Group>
            <CredTypeSuppliment>
              {credType === 'keyfile' && (
                <KeyFileUpload beforeUpload={beforeKeyUploade}>
                  <Button icon={<UploadOutlined />}>Upload key file</Button>
                </KeyFileUpload>
              )}
              {credType === 'password' && <Input name="password" />}
            </CredTypeSuppliment>
          </>
        </Form.Item>
        <Form.Item hidden name="kdbxFileId">
          <></>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Save
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Select a database"
        visible={openFile}
        footer={false}
        onCancel={closeBrowsePopup}
      >
        <GDriveFile
          onSelect={(name?: string, id?: string, url?: string) => {
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
          }}
        />
      </Modal>
      {/* <Dialog fullScreen open={open}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              {project ? 'Edit Project' : 'Create Project'}
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="close"
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md">
          <ValidatorForm
            onSubmit={() => onSave({ ...values, kdbxFileId: fileId })}
          >
            <TextValidator
              value={values.uuid}
              validators={['required']}
              errorMessages={['This field is required']}
              fullWidth
              label="ID"
              name="uuid"
              margin="normal"
              InputProps={{
                disabled: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <FingerprintIcon />
                  </InputAdornment>
                ),
                endAdornment: !project && (
                  <InputAdornment position="start">
                    <RefreshIcon
                      className={classes.clickable}
                      onClick={() => onChange('uuid', v4())}
                    />
                  </InputAdornment>
                )
              }}
            />
            <TextValidator
              value={values.name}
              onChange={evt => onChange('name', evt)}
              validators={['required']}
              errorMessages={['This field is required']}
              fullWidth
              label="Name"
              name="name"
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SubjectIcon />
                  </InputAdornment>
                )
              }}
            />
            <TextValidator
              value={values.kdbxName}
              onChange={evt => onChange('kdbxFileId', evt)}
              validators={['required']}
              errorMessages={['This field is required']}
              fullWidth
              label="KDBX"
              name="kdbxName"
              margin="normal"
              InputProps={{
                disabled: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <StorageIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                    <DownloadIcon
                      className={classes.clickable}
                      onClick={() => setOpenFile(true)}
                    />
                  </InputAdornment>
                )
              }}
            />
            <FormControl className={classes.formControl} fullWidth>
              <FormLabel className={classes.formLabel}>
                Credentials Type
              </FormLabel>
              <RadioGroup
                aria-label="cred-type"
                className={classes.credType}
                name="credType"
                value={values.credType}
                onChange={evt => onChange('credType', evt)}
              >
                <FormControlLabel
                  value=""
                  control={<Radio />}
                  label="Set Later"
                />
                <FormControlLabel
                  value="key-file"
                  control={<Radio />}
                  label="Key File"
                />
                <FormControlLabel
                  value="password"
                  control={<Radio />}
                  label="Password"
                />
              </RadioGroup>
            </FormControl>
            {values.credType === 'key-file' && (
              <FormControl className={classes.formControl} fullWidth>
                <FormLabel className={classes.formLabel}>Key File</FormLabel>
                <Input
                  fullWidth
                  type="file"
                  onChange={evt => onChange('keyFile', evt)}
                ></Input>
              </FormControl>
            )}
            {values.credType === 'password' && (
              <TextValidator
                value={values.password}
                type="password"
                onChange={evt => onChange('password', evt)}
                errorMessages={['This field is required']}
                fullWidth
                label="Password"
                name="password"
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  )
                }}
              />
            )}
            <Box className={classes.actions}>
              {project && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => onDelete(project && project.uuid)}
                >
                  Delete
                </Button>
              )}
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Box>
          </ValidatorForm>
        </Container>
      </Dialog> */}
    </Wrapper>
  )
}

export default ProjectForm
