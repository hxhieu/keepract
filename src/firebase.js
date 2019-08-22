import firebase from 'firebase/app'
import 'firebase/auth'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyDBB3j0qJC2af95_456Gq87kiNDyPGv6-o',
  authDomain: 'keepract.firebaseapp.com',
  databaseURL: 'https://keepract.firebaseio.com',
  projectId: 'keepract',
  storageBucket: '',
  messagingSenderId: '512352375225',
  appId: '1:512352375225:web:192e3f121d8b8405'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
