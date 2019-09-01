import { IReducerAction } from '../types'
import { IAlertState } from '../contexts/alert'

export default (state: IAlertState, action: IReducerAction) => {
  switch (action.type) {
    case 'SHOW_ALERT':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
