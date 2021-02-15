import { FC } from 'react'
import { Layout } from 'antd'
import { geekblue as mainColour } from '@ant-design/colors'
import { RecoilRoot } from 'recoil'
import styled from '@emotion/styled'
import TopBar from './containers/TopBar'
import Firebase from './containers/Firebase'
import MainRouter from './router'

const { Content, Footer } = Layout

const StickyFooter = styled(Footer)`
  text-align: center;
  background: ${mainColour};
  border-top: 1px solid ${mainColour[1]};
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px;
`

const MainContent = styled(Content)`
  padding: 10px 20px 50px 20px;
`

const Shell = styled(Layout)`
  background: transparent;
`

const App: FC = () => {
  return (
    <RecoilRoot>
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
    </RecoilRoot>
  )
}

export default App
