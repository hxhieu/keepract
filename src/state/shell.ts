import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
  key: 'mitmeo-vault-state', // this key is using to store data in local storage
  storage: localStorage, // configurate which stroage will be used to store the data
})

const accessTokenState = atom<string | undefined>({
  key: 'accessTokenState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
})

export { accessTokenState }
