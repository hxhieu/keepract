import React, { FC, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Layout } from 'antd'
import { useSetRecoilState } from 'recoil'
import styled from '@emotion/styled'
import { Global, css } from '@emotion/react'
import TopBar from './containers/TopBar'
import Firebase, { getAuth } from './containers/Firebase'
import MainRouter from './router'
import { primaryBg, primaryBorder } from './styles'
import { ProjectInfo } from './types'
import { projectListState } from './state/project'
import { getStorage } from './storage'
import { useAuthState } from 'react-firebase-hooks/auth'

const { Content, Footer } = Layout

const StickyFooter = styled(Footer)`
  text-align: center;
  background: ${primaryBg};
  border-top: 1px solid ${primaryBorder};
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px;
`

const MainContent = styled(Content)`
  padding: 0px 40px 60px 40px;
`

const Shell = styled(Layout)`
  background: transparent;
`

const App: FC = () => {
  const storage = getStorage('project')

  const [user] = useAuthState(getAuth())

  const setProjects = useSetRecoilState(projectListState)

  // Load projects at start
  useEffect(() => {
    const loadProjects = async () => {
      if (!user) {
        return
      }
      let keys = await storage.keys()
      // Filter by user
      keys = keys.filter((x) => x.indexOf(user.email || '') === 0)
      const allProjects: ProjectInfo[] = []
      for (const x of keys) {
        const project = (await storage.getItem(x)) as ProjectInfo
        if (project) {
          allProjects.push(project)
        }
      }
      setProjects(allProjects)
    }
    loadProjects()
  }, [user, storage, setProjects])

  return (
    <Router>
      <Global
        styles={css`
          html,
          body {
            margin: 0;
            padding: 0;
            font-size: 16px;
            font-family: 'Roboto', Arial, sans-serif;

            .ant-form-item-label label {
              font-weight: bold;
            }
          }
        `}
      />
      <Firebase />
      <TopBar />
      <Shell>
        <MainContent>
          <MainRouter />
        </MainContent>
        <StickyFooter>
          Mitmeo Vault &copy; {new Date().getFullYear()}
          &nbsp;
          <a href="https://mitmeo.studio" target="_blank" rel="noreferrer">
            mitmeo.studio
          </a>
        </StickyFooter>
      </Shell>
    </Router>
  )
}

export default App
