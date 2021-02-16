import React, { useState, useEffect, FC } from 'react'
import { Form } from 'antd'
import * as ab2str from 'arraybuffer-to-string'
import { v4 } from 'uuid'
import GDriveFile from './GDriveFile'
import { IProject } from '../types'

interface ProjectFormProps {
  project?: IProject
  onSave: (project: IProject) => void
  onDelete: (uuid: string) => void
}

const ProjectForm: FC<ProjectFormProps> = (props) => {
  const { uuid, name, kdbxFileId, kdbxName, credType, password, keyFile } =
    props.project || {}
  const [state, setState] = useState<IProject>({
    uuid,
    name,
    kdbxFileId,
    kdbxName,
    credType,
    password,
    keyFile,
  })
  const [openFile, setOpenFile] = useState(false)
  const [fileId, setFileId] = useState('')

  function onChange(key: string, evt: any | string) {
    let value = ''
    if (typeof evt === 'object') {
      // File upload
      if (evt.target.files) {
        const reader = new FileReader()
        reader.onloadend = () => {
          value = ab2str(reader.result)
          setState({
            ...state,
            [key]: value,
          })
        }
        reader.readAsArrayBuffer(evt.target.files[0])
      } else {
        value = evt.target.value
      }
    } else {
      value = evt
    }

    setState({
      ...state,
      [key]: value,
    })

    if (key === 'kdbxName') setOpenFile(false)
  }

  return (
    <>
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
    </>
  )
}

export default ProjectForm
