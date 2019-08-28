import { createContext, useContext } from 'react'

const alertContext = createContext(null)

const initialAlert = {
  type: null,
  message: null
}

const useAlertContext = () => {
  return useContext(alertContext)
}

export default alertContext
export { initialAlert, useAlertContext }
