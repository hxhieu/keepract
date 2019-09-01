import { createContext, useContext, Dispatch } from 'react'
import { IReducerAction } from '../types'

export interface IAuthUser {
  email?: string
}

export interface IAuthState {
  user?: IAuthUser
  initialising: boolean
  accessToken?: string
}

export interface IAuthContext {
  auth: IAuthState
  dispatch: Dispatch<IReducerAction>
}

const initialAuth: IAuthState = {
  user: undefined,
  initialising: true,
  accessToken: undefined
}

const authContext = createContext({} as IAuthContext)

const useAuthContext = () => {
  return useContext(authContext)
}

export default authContext
export { initialAuth, useAuthContext }
