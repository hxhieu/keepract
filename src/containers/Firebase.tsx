import { useEffect } from 'react'
import firebase, { User, auth } from 'firebase/app'
import 'firebase/auth'
import { useAuthContext } from '../contexts/auth'
import { getStorage } from '../storage'

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
  projectId: 'keepract'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const login = () => {
  firebase.auth().signInWithRedirect(provider)
}
const logout = async () => {
  await getStorage('token').removeItem(ACCESS_TOKEN_KEY, undefined)
  firebase.auth().signOut()
}

const mapUser = (firebaseUser: User) => {
  if (!firebaseUser) return null
  const { email } = firebaseUser
  return { email }
}

export default () => {
  const { dispatch } = useAuthContext()
  const tokenStore = getStorage('token')

  useEffect(() => {
    // Temp value to deal with async
    let accessToken: string = ''
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        dispatch({
          type: 'SET_AUTH',
          payload: {
            initialising: false,
            user: null,
            accessToken: null
          }
        })
        return
      }

      if (!accessToken) {
        accessToken = await tokenStore.getItem(ACCESS_TOKEN_KEY)
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
        const idToken = await user.getIdTokenResult()
        const expiresIn = Math.floor(
          (Date.parse(idToken.expirationTime) - new Date().getTime()) / 1000
        )
        gapi.auth.setToken({
          access_token: accessToken,
          expires_in: expiresIn.toString(),
          error: '',
          state: ''
        })
        dispatch({
          type: 'SET_AUTH',
          payload: {
            initialising: false,
            user: mapUser(user),
            accessToken
          }
        })
      }
    })

    // Login redirect handler
    firebase
      .auth()
      .getRedirectResult()
      .then(async result => {
        if (result.credential) {
          // We need to store the result in a temp var because save to local storage is async
          // and will happen AFTER the firebase onAuthStateChanged
          accessToken = (result.credential as auth.OAuthCredential)
            .accessToken as string
          await tokenStore.setItem(ACCESS_TOKEN_KEY, accessToken)
        }
      })
      .catch(error => {
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
  }, [dispatch, tokenStore])

  // This component has no presenter
  return null
}
export { login, logout }
