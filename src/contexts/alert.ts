import { createContext, useContext, Dispatch } from 'react'
import { IReducerAction } from '../types'

export interface IAlertState {
  type: string
  message?: string
}

export interface IAlertContext {
  alert: IAlertState
  dispatch: Dispatch<IReducerAction>
}

const initialAlert: IAlertState = {
  type: '',
  message: undefined
}

const alertContext = createContext({} as IAlertContext)

const useAlertContext = () => {
  return useContext(alertContext)
}

export default alertContext
export { initialAlert, useAlertContext }
