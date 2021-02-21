import { Group } from 'kdbxweb'
import { atom } from 'recoil'
import { ProjectInfo } from '../types'

const projectListState = atom<ProjectInfo[]>({
  key: 'projectListState',
  default: [],
})

const projectGroupState = atom<Group | undefined>({
  key: 'projectGroupState',
  default: undefined,
})

const currentProjectState = atom<string | undefined>({
  key: 'currentProjectState',
  default: undefined,
})

export { projectListState, projectGroupState, currentProjectState }
