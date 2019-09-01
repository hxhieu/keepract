import { IAuthState } from '../contexts/auth'
import { IReducerAction } from '../types'

export default (state: IAuthState, action: IReducerAction): IAuthState => {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
