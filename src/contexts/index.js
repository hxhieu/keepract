import { createContext, useContext } from 'react'

/**
 * The file enables `index.js` to import all contextes
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const files = require.context('.', false, /\.js$/)
const contexts = {}

files.keys().forEach(key => {
  if (key === './index.js') {
    return
  }
  contexts[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

const appContext = createContext(contexts)

const useAuthContext = () => {
  const { auth } = useContext(appContext)
  return auth
}

export { useAuthContext }

export default appContext
