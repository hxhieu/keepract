export type CredType = 'password' | 'keyfile' | 'none'

export interface IReducerAction {
  type: string
  payload: any
}

export interface IProject {
  name?: string
  uuid?: string
  kdbxName?: string
  kdbxFileId?: string
  credType?: CredType
  password?: string
  keyFile?: string
}
