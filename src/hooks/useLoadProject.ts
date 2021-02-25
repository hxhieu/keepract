import { Credentials, Kdbx, ProtectedValue } from 'kdbxweb'
import { useEffect, useState } from 'react'
import { useParams, useRouteMatch } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  cachedProjectState,
  currentProjectState,
  projectGroupState,
  projectListState,
} from '../state/project'
import { KdbxGroupRouteParams, ProjectInfo } from '../types'
import { str2ab } from '../utils/str2ab'

const fetchProject = async (project: ProjectInfo) => {
  const { kdbxFileId: fileId, keyFile, credType, password } = project

  if (!fileId) {
    throw new Error('The project is corrupted, no KDBX file set.')
  }

  const response = await gapi.client.drive.files.get({
    fileId,
    alt: 'media',
  })

  const dbBuff = str2ab(response.body)
  let cred: Credentials = new Credentials(
    ProtectedValue.fromString(password || ''),
    null
  )

  if (credType === 'keyfile') {
    const keyBuff = str2ab(atob(keyFile || ''))
    cred = new Credentials(null, keyBuff)
  }

  const db = await Kdbx.load(dbBuff, cred)

  // Group zero is the database itself
  return db.groups[0]
}

const useLoadProject = (error?: (msg: string) => any): boolean => {
  // Recoil states
  const projects = useRecoilValue(projectListState)
  const setProject = useSetRecoilState(currentProjectState)
  const setProjectGroup = useSetRecoilState(projectGroupState)
  const [cachedProjectId, setCachedProjectId] = useRecoilState(
    cachedProjectState
  )

  // Router state
  const { uuid } = useParams<KdbxGroupRouteParams>()
  const { url } = useRouteMatch()

  // Local state
  const [loading, setLoading] = useState(false)

  // Load root group
  useEffect(() => {
    const found = projects.find((x) => x.uuid === uuid)
    if (found) {
      setProject(found)
      if (!!uuid && uuid !== cachedProjectId) {
        setLoading(true)
        fetchProject(found)
          .then((group) => {
            setProjectGroup(group)
            setCachedProjectId(found?.uuid)
          })
          .catch((err) => {
            setProjectGroup(undefined)
            setCachedProjectId(undefined)
            try {
              const body = JSON.parse(err.body)
              error && error(body.error.message)
            } catch (parseErr) {
              error && error(parseErr.message)
            }
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }
  }, [url, projects])

  return loading
}

export { useLoadProject }
