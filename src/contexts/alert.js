import { createContext, useContext } from 'react'

const alertContext = createContext(null)

const initialAlert = {
  type: null,
  message: null
}

const useAlert = () => {
  return useContext(alertContext)
}

export default alertContext
export { initialAlert, useAlert }
