import { useContext, useState, useEffect } from 'react'
import { createInstance, INDEXEDDB } from 'localforage'
import firebase from 'firebase/app'
import 'firebase/auth'
import AppContext from '../contexts'

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

const ACCESS_TOKEN_KEY = 'accessToken'
const provider = new firebase.auth.GoogleAuthProvider()
provider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly')

const tokenStore = createInstance({
  driver: INDEXEDDB,
  name: 'keepract',
  version: 1.0,
  storeName: 'token_store'
})

const mapUser = firebaseUser => {
  if (!firebaseUser) return null
  const { email } = firebaseUser
  return { email }
}

const useAuthContext = () => {
  const { auth } = useContext(AppContext)
  return auth
}

const useFirebase = () => {
  const [state, setState] = useState(() => {
    const user = firebase.auth().currentUser
    return {
      initialising: !user,
      user: mapUser(user),
      accessToken: null
    }
  })

  useEffect(() => {
    // Temp value to deal with async
    let accessToken

    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        setState({
          initialising: false,
          user: null
        })
        return
      }

      if (!accessToken) {
        accessToken = await tokenStore.getItem(ACCESS_TOKEN_KEY)
      }
      // Need new access token
      if (!accessToken) {
        user.reauthenticateWithRedirect(provider)
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
        window.gapi.auth.setToken({
          access_token: accessToken,
          expires_in: expiresIn.toString(),
          error: '',
          state: ''
        })
        setState({
          initialising: false,
          user: mapUser(user)
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
          accessToken = result.credential.accessToken
          await tokenStore.setItem(ACCESS_TOKEN_KEY, accessToken)
        }
      })
      .catch(error => {
        // TODO: Handle errors
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
        // ...
      })

    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, [])

  return state
}

const login = () => {
  firebase.auth().signInWithRedirect(provider)
}
const logout = async () => {
  await tokenStore.removeItem(ACCESS_TOKEN_KEY, null)
  firebase.auth().signOut()
}

export { useAuthContext, useFirebase, login, logout }
