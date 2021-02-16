import React, { useState, useEffect, FC } from 'react'
import {
  ToolTwoTone,
  ReloadOutlined,
  TagTwoTone,
  DatabaseTwoTone,
  DownloadOutlined,
} from '@ant-design/icons'
import { Form, Input, Button } from 'antd'
import styled from '@emotion/styled'
import * as ab2str from 'arraybuffer-to-string'
import { nanoid } from 'nanoid'
import GDriveFile from './GDriveFile'
import { IProject } from '../types'
import { primaryBorder, primaryColour } from '../styles'

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

const ProjectForm: FC<ProjectFormProps> = (props) => {
  const [form] = Form.useForm()
  const { uuid, name, kdbxFileId, kdbxName, credType, password, keyFile } =
    props.project || {}
  const [state, setState] = useState<IProject>({
    uuid: uuid || nanoid(),
    name,
    kdbxFileId,
    kdbxName,
    credType,
    password,
    keyFile,
  })
  const [openFile, setOpenFile] = useState(false)
  const [fileId, setFileId] = useState('')

  const onChange = (value: IProject) => {
    console.log(value.name)
    // let value = ''
    // if (typeof evt === 'object') {
    //   // File upload
    //   if (evt.target.files) {
    //     const reader = new FileReader()
    //     reader.onloadend = () => {
    //       value = ab2str(reader.result)
    //       setState({
    //         ...state,
    //         [key]: value,
    //       })
    //     }
    //     reader.readAsArrayBuffer(evt.target.files[0])
    //   } else {
    //     value = evt.target.value
    //   }
    // } else {
    //   value = evt
    // }

    // setState({
    //   ...state,
    //   [key]: value,
    // })

    // if (key === 'kdbxName') setOpenFile(false)
  }

  const refreshUuid = () => {
    form.setFields([{ name: 'uuid', value: nanoid() }])
  }

  return (
    <Wrapper>
      <Form
        form={form}
        size="large"
        initialValues={state}
        layout="vertical"
        onValuesChange={onChange}
      >
        <Form.Item label="UUID" name="uuid">
          <Input
            prefix={<ToolTwoTone />}
            suffix={
              !props.project && <GenerateUuidButton onClick={refreshUuid} />
            }
            disabled
          />
        </Form.Item>
        <Form.Item label="Name" name="name">
          <Input prefix={<TagTwoTone />} />
        </Form.Item>
        <Form.Item label="KDBX" name="kdbxName">
          <Input
            prefix={<DatabaseTwoTone />}
            suffix={<DownloadKdbxButton />}
            disabled
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" size="large">
            Save
          </Button>
        </Form.Item>
      </Form>
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

      {/* GDrive dialog */}
      {/* <Dialog open={openFile} fullWidth maxWidth="sm">
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Select a database
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="close"
              onClick={() => setOpenFile(false)}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <GDriveFile
          onSelect={(name: string, id: string, url?: string) => {
            onChange('kdbxName', name)
            // Dont know why but need separate state and cannot call onChange() twice
            setFileId(id || '')
          }}
        />
      </Dialog> */}
    </Wrapper>
  )
}

export default ProjectForm
