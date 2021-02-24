export type CredType = 'password' | 'keyfile' | 'none' | undefined

export const GROUP_IDS_SEPARATOR = ';'

export interface ProjectInfo {
  name?: string
  uuid?: string
  kdbxName?: string
  kdbxFileId?: string
  credType?: CredType
  password?: string
  keyFile?: string
}

export interface KdbxItem {
  name: string
  notes?: string
  uuid?: string
  isGroup: boolean
}

export interface KdbxGroupRouteParams {
  uuid: string
  groupIds?: string
}
