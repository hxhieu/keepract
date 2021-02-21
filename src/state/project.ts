import { atom } from 'recoil'
import { ProjectInfo } from '../types'

const projectListState = atom<ProjectInfo[]>({
  key: 'projectListState',
  default: [],
})

export { projectListState }
