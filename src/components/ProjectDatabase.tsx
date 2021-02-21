import React, { useState, useEffect } from 'react'
import * as str2ab from 'string-to-arraybuffer'
import { ProjectInfo } from '../types'
import { Credentials, Kdbx, Group } from 'kdbxweb'
import KdbxGroupPopup from './kdbx/KdbxGroupPopup'

interface IGroupList {
  list?: Group[]
  loading: boolean
}

export default ({
  project,
  onClose,
}: {
  project: ProjectInfo
  onClose: () => void
}) => {
  const [groups, setGroups] = useState<IGroupList>({
    loading: true,
    list: undefined,
  })

  useEffect(() => {
    const { kdbxFileId: fileId } = project
    if (!fileId) {
      alert('Corrupted project, database undefined')
      return
    }
    const fetchFile = async () => {
      try {
        const response = await gapi.client.drive.files.get({
          fileId,
          alt: 'media',
        })

        const dbBuff = str2ab(response.body)
        const keyBuff = str2ab(project.keyFile)

        const cred = new Credentials(null, keyBuff)

        const db = await Kdbx.load(dbBuff, cred)
        setGroups({
          loading: false,
          list: db.groups,
        })
      } catch (err) {
        alert(JSON.stringify(err))
        throw err
      }
    }
    fetchFile()
  }, [project])

  return (
    <KdbxGroupPopup
      open={!!project}
      group={groups.list && groups.list[0]}
      onClose={onClose}
    />
  )
}
