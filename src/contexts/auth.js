import { createContext, useContext } from 'react'

const authContext = createContext(null)

const initialAuth = {
  user: null,
  initialising: true,
  accessToken: null
}

const useAuthContext = () => {
  return useContext(authContext)
}

export default authContext
export { initialAuth, useAuthContext }
