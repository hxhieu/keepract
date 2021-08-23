import firebase from 'firebase/app'
import 'firebase/auth'

import { FC, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { message as messageBox } from 'antd'
import { accessTokenExpireState, accessTokenState } from '../state/shell'

// Your web app's Firebase configuration
var firebaseConfig = {
  appId: import.meta.env.VITE_FIRE_APP_ID,
  apiKey: import.meta.env.VITE_FIRE_API_KEY,
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
  firebase
    .auth()
    .signOut()
    .catch(({ message }: { message: string }) => {
      messageBox.error(`${message}`, 0)
    })
}

const login = () => {
  firebase
    .auth()
    .signInWithRedirect(buildProvider())
    .catch(({ message }: { message: string }) => {
      messageBox.error(`${message}`, 0)
    })
}

const getAuth = () => firebase.auth()

const Firebase: FC = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [expire, setExpire] = useRecoilState(accessTokenExpireState)

  useEffect(() => {
    // Token has expired
    if (expire > 0 && expire <= Date.now() / 1000) {
      // Set it to never expires,
      // so after the login redirect we still can process
      setExpire(253402261199)
      login()
    }
  }, [expire, setExpire])

  // Check existing login
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      return setAccessToken(undefined)
    }

    // Check the local token validity
    // Dont refresh it because we need to refresh the access token too
    const tokenResult = await user.getIdTokenResult(false)
    if (!tokenResult || !tokenResult.token) {
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
        const { accessToken } = authResult
        // We can use this API to get the access token detail, if need
        // https://www.googleapis.com/oauth2/v2/tokeninfo?access_token=
        const tokenInfoResult = await fetch(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
        )
        const accessTokenPayload = await tokenInfoResult.json()
        setAccessToken(accessToken)
        const expireAt =
          Math.floor(Date.now() / 1000) + accessTokenPayload.expires_in
        setExpire(expireAt)
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
