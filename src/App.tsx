import { FC } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Layout } from 'antd'
import { RecoilRoot } from 'recoil'
import styled from '@emotion/styled'
import { Global, css } from '@emotion/react'
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
        <Global
          styles={css`
            html,
            body {
              margin: 0;
              padding: 0;
              font-size: 16px;
              font-family: 'Source Sans Pro', 'Arial', 'san-serif';
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
