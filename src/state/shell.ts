import { atom } from 'recoil'

const accessTokenState = atom<string | undefined>({
  key: 'accessTokenState',
  default: undefined,
})

const userEmailState = atom<string | undefined>({
  key: 'userEmailState',
  default: undefined,
})

export { accessTokenState, userEmailState }
