import { FC } from 'react'
import { Layout } from 'antd'
import { RecoilRoot } from 'recoil'
import TopBar from './containers/TopBar'
import Firebase from './containers/Firebase'
import MainRouter from './router'

const { Content, Footer } = Layout

const App: FC = () => {
  return (
    <RecoilRoot>
      <Firebase />
      <Layout>
        <TopBar />
        <Layout>
          <Content style={{ margin: '24px 16px 0' }}>
            <MainRouter />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </RecoilRoot>
  )
}

export default App
