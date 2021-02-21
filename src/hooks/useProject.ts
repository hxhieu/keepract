import { Credentials, Kdbx, ProtectedValue } from 'kdbxweb'
import { useSetRecoilState } from 'recoil'
import * as str2ab from 'string-to-arraybuffer'
import { currentProjectState, projectGroupState } from '../state/project'
import { ProjectInfo } from '../types'

const useProjects = () => {
  const setProjectGroup = useSetRecoilState(projectGroupState)
  const setCurrentProjectId = useSetRecoilState(currentProjectState)

  const fetchProject = async (project: ProjectInfo) => {
    const { uuid, kdbxFileId: fileId, keyFile, credType, password } = project

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

    setCurrentProjectId(uuid)
    // Group zero is the database itself
    setProjectGroup(db.groups[0])
  }

  return {
    fetchProject,
  }
}

export { useProjects }
