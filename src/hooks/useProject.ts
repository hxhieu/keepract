import { Credentials, Group, Kdbx, ProtectedValue } from 'kdbxweb'
import { useEffect, useState } from 'react'
import { useParams, useRouteMatch } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import * as str2ab from 'string-to-arraybuffer'
import {
  cachedProjectState,
  currentProjectState,
  projectGroupState,
  projectListState,
} from '../state/project'
import { GROUP_IDS_SEPARATOR, KdbxItem, ProjectInfo } from '../types'

interface KdbxGroupRouteParams {
  uuid: string
  groupIds?: string
}

const useProjects = () => {
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

  const buildLoadedGroups = (
    group: Group,
    allGroups: string[],
    error?: (msg: string) => any
  ): [Group, KdbxItem[]] => {
    let currentGroup: Group = group
    let groupLevel = 0
    const loadedGroups: KdbxItem[] = []

    // Read all groups in the path
    // For breadcrumb
    while (groupLevel < allGroups.length) {
      const nextId = allGroups[groupLevel]
      const found = currentGroup.groups.find((x) => x.uuid.id === nextId)
      if (found) {
        currentGroup = found
        loadedGroups.push({
          name: found.name.toString(),
          uuid: found.uuid.id,
          isGroup: true,
        })
      } else {
        // Groups not in valid sequence
        // then we stop the process
        error && error(`Could not open the group id: ${nextId}`)
        break
      }
      groupLevel++
    }
    return [currentGroup, loadedGroups]
  }

  const buildCurrentGroup = (currentGroup: Group): KdbxItem[] => {
    const { groups, entries } = currentGroup

    const items: KdbxItem[] = []
    if (groups)
      groups.forEach((x) => {
        items.push({
          name: x.name as string,
          uuid: x.uuid.id,
          isGroup: true,
        })
      })

    if (entries)
      entries.forEach((x) => {
        const { fields, uuid } = x
        const { Title, Notes } = fields
        items.push({
          name: Title as string,
          notes: Notes as string,
          uuid: uuid.id,
          isGroup: false,
        })
      })
    return items
  }

  const useLoadCurrentGroup = (
    error?: (msg: string) => any
  ): [KdbxItem[], KdbxItem[]] => {
    const group = useRecoilValue(projectGroupState)

    const { groupIds } = useParams<KdbxGroupRouteParams>()
    const { url } = useRouteMatch()
    const allGroups = (groupIds
      ? groupIds.split(GROUP_IDS_SEPARATOR)
      : []
    ).map((x) => atob(x))

    const [items, setItems] = useState<KdbxItem[]>([])
    const [loadedGroups, setLoadedGroups] = useState<KdbxItem[]>([])

    useEffect(() => {
      if (!group) {
        setItems([])
        return
      }
      // Build items in the router path
      const [currentGroup, loadedGroups] = buildLoadedGroups(
        group,
        allGroups,
        error
      )
      setLoadedGroups(loadedGroups)
      // Then build all items in current path
      const items = buildCurrentGroup(currentGroup)
      setItems(items)
    }, [group, url])

    return [items, loadedGroups]
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
              const body = JSON.parse(err.body)
              error && error(body.error.message)
            })
            .finally(() => {
              setLoading(false)
            })
        }
      }
    }, [url, projects])

    return loading
  }

  return {
    useLoadProject,
    useLoadCurrentGroup,
  }
}

export { useProjects }
