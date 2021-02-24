import React, { FC } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { accessTokenState } from '../../state/shell'

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const accessToken = useRecoilValue(accessTokenState)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        accessToken ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

export default PrivateRoute
