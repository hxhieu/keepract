import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Project from './pages/Project'
import KdbxGroup from './pages/KdbxGroup'
import PrivateRoute from './components/common/PrivateRoute'
import KdbxEntry from './pages/KdbxEntry'

const MainRouter = () => (
  <Switch>
    <PrivateRoute path="/project/:uuid/group/:groupIds?/entry/:entryId">
      <KdbxEntry />
    </PrivateRoute>
    <PrivateRoute path="/project/:uuid/group/:groupIds?">
      <KdbxGroup />
    </PrivateRoute>
    <PrivateRoute path="/project/:uuid?">
      <Project />
    </PrivateRoute>
    <Route path="/">
      <Home />
    </Route>
  </Switch>
)

export default MainRouter
