export type CredType = 'password' | 'keyfile' | 'none' | undefined

export interface ProjectInfo {
  name?: string
  uuid?: string
  kdbxName?: string
  kdbxFileId?: string
  credType?: CredType
  password?: string
  keyFile?: string
}
