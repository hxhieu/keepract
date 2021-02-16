export interface IReducerAction {
  type: string
  payload: any
}

export interface IProject {
  name?: string
  uuid?: string
  kdbxName?: string
  kdbxFileId?: string
  credType?: string
  password?: string
  keyFile?: string
}
