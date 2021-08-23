import { KdbxGroup } from 'kdbxweb'
import { useEffect, useState } from 'react'
import { useParams, useRouteMatch } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { projectGroupState } from '../state/project'
import { GROUP_IDS_SEPARATOR, KdbxGroupRouteParams, KdbxItem } from '../types'
import { getKdbxFieldValue } from '../utils'

const buildLoadedGroups = (
  rootGroup: KdbxGroup,
  allGroups: string[],
  error?: (msg: string) => any
): [KdbxGroup, KdbxItem[]] => {
  let currentGroup: KdbxGroup | undefined = rootGroup
  let groupLevel = 0
  const loadedGroups: KdbxItem[] = []

  // Read all groups in the path
  // For breadcrumb
  while (groupLevel < allGroups.length) {
    const nextId = allGroups[groupLevel]
    currentGroup = currentGroup?.groups.find((x) => x.uuid.id === nextId)
    if (currentGroup) {
      loadedGroups.push({
        name: currentGroup.name?.toString() || 'UNKNOWN',
        uuid: currentGroup.uuid.id,
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
  return [currentGroup as KdbxGroup, loadedGroups]
}

const buildCurrentGroup = (currentGroup: KdbxGroup): KdbxItem[] => {
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
      const title = fields.get('Title')
      const notes = fields.get('Notes')
      items.push({
        name: getKdbxFieldValue(title) || 'UNKNOWN',
        notes: getKdbxFieldValue(notes),
        uuid: uuid.id,
      })
    })
  return items
}

const useLoadCurrentGroup = (
  error?: (msg: string) => any
): [KdbxItem[], KdbxItem[], KdbxGroup] => {
  const rootGroup = useRecoilValue(projectGroupState)

  const { groupIds } = useParams<KdbxGroupRouteParams>()
  const { url } = useRouteMatch()
  const allGroups = (groupIds ? groupIds.split(GROUP_IDS_SEPARATOR) : []).map(
    (x) => atob(x)
  )

  const [items, setItems] = useState<KdbxItem[]>([])
  const [loadedGroups, setLoadedGroups] = useState<KdbxItem[]>([])
  const [selectedGroup, setSelectedGroup] = useState<KdbxGroup>()

  useEffect(() => {
    if (!rootGroup) {
      setItems([])
      return
    }
    // Build items in the router path
    const [currentGroup, loadedGroups] = buildLoadedGroups(
      rootGroup,
      allGroups,
      error
    )
    setSelectedGroup(currentGroup)
    setLoadedGroups(loadedGroups)
    // Then build all items in current path
    const items = buildCurrentGroup(currentGroup)
    setItems(items)
  }, [rootGroup, url])

  return [items, loadedGroups, selectedGroup as KdbxGroup]
}

export { useLoadCurrentGroup }
