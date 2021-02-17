import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Project from './pages/Project'

const MainRouter = () => (
  <Switch>
    <Route path="/project/:uuid?">
      <Project />
    </Route>
    <Route path="/">
      <Home />
    </Route>
  </Switch>
)

export default MainRouter
