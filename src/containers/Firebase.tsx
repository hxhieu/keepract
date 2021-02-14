import { useEffect, FC } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import firebase from 'firebase/app'
import 'firebase/auth'
import { accessTokenState } from '../state/shell'

const ACCESS_TOKEN_KEY = 'accessToken'
const provider = new firebase.auth.GoogleAuthProvider()
// TODO: Restricted scope
provider.addScope('https://www.googleapis.com/auth/drive.readonly')

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

const login = () => {
  firebase.auth().signInWithRedirect(provider)
}
const logout = async () => {
  firebase.auth().signOut()
}

const Firebase: FC = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        setAccessToken(undefined)
        return
      }

      // Need new access token
      if (!accessToken) {
        login()
      } else {
        // TODO: Revalidate access token
        // const idToken = await user.getIdToken()
        // const credential = firebase.auth.GoogleAuthProvider.credential(
        //   idToken,
        //   accessToken
        // )
        // await user.reauthenticateWithCredential(credential)

        // Update GAPI with new tokens
        const tokenResult = await user.getIdTokenResult()
        const expiresIn = Math.floor(
          (Date.parse(tokenResult.expirationTime) - new Date().getTime()) / 1000
        )
        gapi.auth.setToken({
          access_token: accessToken,
          expires_in: expiresIn.toString(),
          error: '',
          state: '',
        })
        setAccessToken(tokenResult.token)
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
      .catch((error) => {
        // TODO: Handle errors
        // // Handle Errors here.
        // var errorCode = error.code
        // var errorMessage = error.message
        // // The email of the user's account used.
        // var email = error.email
        // // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential
        // // ...
      })

    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, [accessToken])

  // This component has no presenter
  return null
}

export default Firebase
export { login, logout }
