import { Group } from 'kdbxweb'
import { useEffect, useState } from 'react'
import { useParams, useRouteMatch } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { projectGroupState } from '../state/project'
import { GROUP_IDS_SEPARATOR, KdbxGroupRouteParams, KdbxItem } from '../types'
import { getKdbxFieldValue } from '../utils'

const buildLoadedGroups = (
  rootGroup: Group,
  allGroups: string[],
  error?: (msg: string) => any
): [Group, KdbxItem[]] => {
  let currentGroup: Group | undefined = rootGroup
  let groupLevel = 0
  const loadedGroups: KdbxItem[] = []

  // Read all groups in the path
  // For breadcrumb
  while (groupLevel < allGroups.length) {
    const nextId = allGroups[groupLevel]
    currentGroup = currentGroup?.groups.find((x) => x.uuid.id === nextId)
    if (currentGroup) {
      loadedGroups.push({
        name: currentGroup.name.toString(),
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
  return [currentGroup as Group, loadedGroups]
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
        name: getKdbxFieldValue(Title),
        notes: getKdbxFieldValue(Notes),
        uuid: uuid.id,
      })
    })
  return items
}

const useLoadCurrentGroup = (
  error?: (msg: string) => any
): [KdbxItem[], KdbxItem[], Group] => {
  const rootGroup = useRecoilValue(projectGroupState)

  const { groupIds } = useParams<KdbxGroupRouteParams>()
  const { url } = useRouteMatch()
  const allGroups = (groupIds
    ? groupIds.split(GROUP_IDS_SEPARATOR)
    : []
  ).map((x) => atob(x))

  const [items, setItems] = useState<KdbxItem[]>([])
  const [loadedGroups, setLoadedGroups] = useState<KdbxItem[]>([])
  const [selectedGroup, setSelectedGroup] = useState<Group>()

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

  return [items, loadedGroups, selectedGroup as Group]
}

export { useLoadCurrentGroup }
