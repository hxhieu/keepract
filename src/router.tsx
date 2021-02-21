import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Project from './pages/Project'
import KdbxGroup from './pages/KdbxGroup'

const MainRouter = () => (
  <Switch>
    <Route path="/project/:uuid?/group/:groupIds?">
      <KdbxGroup />
    </Route>
    <Route path="/project/:uuid?">
      <Project />
    </Route>
    <Route path="/">
      <Home />
    </Route>
  </Switch>
)

export default MainRouter
