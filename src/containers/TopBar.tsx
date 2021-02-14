import React, { useEffect, useState } from 'react'
import { PageHeader, Button } from 'antd'
import { useRecoilState } from 'recoil'
import { geekblue as mainColour } from '@ant-design/colors'
import styled from '@emotion/styled'
import firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import { accessTokenState } from '../state/shell'

const TopBar = () => {
  const [user, loading, error] = useAuthState(firebase.auth())
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)

  firebase
    .auth()
    .getRedirectResult()
    .then(async (result) => {
      if (result.credential) {
        const authResult = result.credential as firebase.auth.OAuthCredential
        console.log(authResult)
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

  const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    // TODO: Restricted scope
    provider.addScope('https://www.googleapis.com/auth/drive.readonly')
    firebase.auth().signInWithRedirect(provider)
    // firebase
    //   .auth()
    //   .getRedirectResult()
    //   .then(async (result) => {
    //     if (result.credential) {
    //       const authResult = result.credential as firebase.auth.OAuthCredential
    //       console.log(authResult.accessToken)
    //     }
    //   })
    //   .catch((error) => {
    //     // TODO: Handle errors
    //     // // Handle Errors here.
    //     // var errorCode = error.code
    //     // var errorMessage = error.message
    //     // // The email of the user's account used.
    //     // var email = error.email
    //     // // The firebase.auth.AuthCredential type that was used.
    //     // var credential = error.credential
    //     // // ...
    //   })
  }
  const logout = () => {
    setAccessToken(undefined)
    firebase.auth().signOut()
  }

  // const renderLoading = () => <CircularProgress color="secondary" />
  // const renderUser = (user: IAuthUser) => {
  //   return (
  //     <>
  //       <Typography variant="body1" className={classes.title}>
  //         {user.email}
  //       </Typography>
  //       <Button color="inherit" onClick={logout}>
  //         Logout
  //       </Button>
  //     </>
  //   )
  // }
  // const renderLogin = () => (
  //   <Button color="inherit" onClick={handleLogin}>
  //     Login
  //   </Button>
  // )

  const Header = styled(PageHeader)`
    background: ${mainColour};
    border-bottom: 1px solid ${mainColour[1]};
    .ant-page-header-heading-title {
      color: ${mainColour[5]};
    }
  `
  return (
    <Header
      className="site-page-header"
      onBack={() => null}
      title="Mitmeo Vault"
      subTitle={user && user.email}
      backIcon={false}
      extra={[
        <Button
          key="1"
          type="primary"
          loading={loading}
          onClick={() => (user ? logout() : login())}
        >
          {user ? 'Logout' : 'Login'}
        </Button>,
      ]}
    />
  )
}

export default TopBar
