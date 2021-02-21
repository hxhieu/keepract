import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Project from './pages/Project'
import ProjectEntries from './pages/ProjectEntries'

const MainRouter = () => (
  <Switch>
    <Route path="/project/:uuid?/entry/:entryId?">
      <ProjectEntries />
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
