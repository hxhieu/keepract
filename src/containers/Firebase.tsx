import firebase from 'firebase/app'
import 'firebase/auth'

import { FC, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { message as messageBox } from 'antd'
import { accessTokenState } from '../state/shell'

// Your web app's Firebase configuration
var firebaseConfig = {
  appId: process.env.REACT_APP_FIRE_APP_ID,
  apiKey: process.env.REACT_APP_FIRE_API_KEY,
  authDomain: 'keepract.firebaseapp.com',
  databaseURL: 'https://keepract.firebaseio.com',
  projectId: 'keepract',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const buildProvider = () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  // TODO: Restricted scope
  provider.addScope('https://www.googleapis.com/auth/drive.readonly')
  return provider
}

const logout = () => {
  firebase.auth().signOut()
}

const login = () => {
  firebase.auth().signInWithRedirect(buildProvider())
}

const getAuth = () => firebase.auth()

const Firebase: FC = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)

  // Check existing login
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      return setAccessToken(undefined)
    }

    // Check the local token validity
    const tokenResult = await user.getIdTokenResult()
    const exp = parseInt(tokenResult.claims['exp'], 10)

    // Token has expired
    if (Date.now() > exp * 1000) {
      // // Clean up the offline detail as the user will need to re-login
      // logout()
      // setAccessToken(undefined)
      // TODO: Check if this work
      user.reauthenticateWithRedirect(buildProvider())
    }
  })

  // Login redirect handler
  firebase
    .auth()
    .getRedirectResult()
    .then(async (result) => {
      if (result.credential) {
        const authResult = result.credential as firebase.auth.OAuthCredential
        setAccessToken(authResult.accessToken)
      }
    })
    .catch(({ message }: { message: string }) => {
      messageBox.error(`${message}`, 0)
    })

  useEffect(() => {
    // All good, we can set the token for GAPI
    if (accessToken) {
      gapi.auth.setToken({
        access_token: accessToken,
        expires_in: '',
        error: '',
        state: '',
      })
    }
  }, [accessToken])

  // This component has no presenter
  return null
}

export default Firebase
export { login, logout, getAuth }
