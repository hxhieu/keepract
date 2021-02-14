import { Layout, Menu } from 'antd'
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'

import React, { useReducer } from 'react'
import Home from './pages/Home'
import TopBar from './containers/TopBar'
import Alert from './containers/Alert'
import Firebase from './containers/Firebase'
import AlertContext, { initialAlert } from './contexts/alert'
import alertReducer from './reducers/alertReducer'
import AuthContext, { initialAuth } from './contexts/auth'
import authReducer from './reducers/authReducer'
import MainRouter from './router'

const { Header, Content, Footer, Sider } = Layout

const App = () => {
  const [alert, alertDispatch] = useReducer(alertReducer, initialAlert)
  const [auth, authDispatch] = useReducer(authReducer, initialAuth)

  return (
    <AlertContext.Provider value={{ alert, dispatch: alertDispatch }}>
      <AuthContext.Provider value={{ auth, dispatch: authDispatch }}>
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken)
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type)
            }}
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
              <Menu.Item key="1" icon={<UserOutlined />}>
                nav 1
              </Menu.Item>
              <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                nav 2
              </Menu.Item>
              <Menu.Item key="3" icon={<UploadOutlined />}>
                nav 3
              </Menu.Item>
              <Menu.Item key="4" icon={<UserOutlined />}>
                nav 4
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header
              className="site-layout-sub-header-background"
              style={{ padding: 0 }}
            />
            <Content style={{ margin: '24px 16px 0' }}>
              {/* <Firebase />
            <Alert /> */}
              <MainRouter />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
        {/* ,
        <ThemeProvider theme={theme}>
          
          <TopBar />
          <Container maxWidth="md"></Container>
          
        </ThemeProvider> */}
      </AuthContext.Provider>
    </AlertContext.Provider>
  )
}

export default App
