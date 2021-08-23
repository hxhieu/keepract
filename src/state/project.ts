import { KdbxGroup } from 'kdbxweb'
import { atom } from 'recoil'
import { ProjectInfo } from '../types'

const projectListState = atom<ProjectInfo[]>({
  key: 'projectListState',
  default: [],
})

const projectGroupState = atom<KdbxGroup | undefined>({
  key: 'projectGroupState',
  default: undefined,
})

const cachedProjectState = atom<string | undefined>({
  key: 'cachedProjectState',
  default: undefined,
})

const currentProjectState = atom<ProjectInfo | undefined>({
  key: 'currentProjectState',
  default: undefined,
})

export {
  projectListState,
  projectGroupState,
  cachedProjectState,
  currentProjectState,
}
