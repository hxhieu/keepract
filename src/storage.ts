import { INDEXEDDB, createInstance } from 'localforage'

export type StorageType = 'token' | 'project'

const stores = new Map<StorageType, LocalForage>()

const getStorage = (type: StorageType) => {
  if (!stores.has(type)) {
    stores.set(
      type,
      createInstance({
        driver: INDEXEDDB,
        name: 'keepract',
        version: 1.0,
        storeName: type,
      })
    )
  }
  return stores.get(type) as LocalForage
}

export { getStorage }
