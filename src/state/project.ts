import { atom } from 'recoil'
import { IProject } from '../types'

const projectListState = atom<IProject[]>({
  key: 'projectListState',
  default: [],
})

export { projectListState }
