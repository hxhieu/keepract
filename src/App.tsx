import { FC } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Layout } from 'antd'
import { RecoilRoot } from 'recoil'
import styled from '@emotion/styled'
import TopBar from './containers/TopBar'
import Firebase from './containers/Firebase'
import MainRouter from './router'
import { primaryBg, primaryBorder } from './styles'

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
  padding: 0px 40px 50px 40px;
`

const Shell = styled(Layout)`
  background: transparent;
`

const App: FC = () => {
  return (
    <RecoilRoot>
      <Router>
        <Firebase />
        <TopBar />
        <Shell>
          <MainContent>
            <MainRouter />
          </MainContent>
          <StickyFooter>
            Mitmeo Vault &copy; {new Date().getFullYear()}
            &nbsp;
            <a href="https://mitmeo.studio" target="_blank">
              mitmeo.studio
            </a>
          </StickyFooter>
        </Shell>
      </Router>
    </RecoilRoot>
  )
}

export default App
