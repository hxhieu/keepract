import React, { useState } from 'react'
import { PageHeader, Button } from 'antd'
import { geekblue as mainColour } from '@ant-design/colors'
import styled from '@emotion/styled'
import { login, logout } from './Firebase'

const TopBar = () => {
  const [loading, setLoading] = useState(false)

  const gotoHome = () => {}
  const handleLogin = () => {
    setLoading(true)
    login()
  }

  // const renderLoading = () => <CircularProgress color="secondary" />
  // const renderUser = (user: IAuthUser) => {
  //   return (
  //     <>
  //       <Typography variant="body1" className={classes.title}>
  //         {user.email}
  //       </Typography>
  //       <Button color="inherit" onClick={logout}>
  //         Logout
  //       </Button>
  //     </>
  //   )
  // }
  // const renderLogin = () => (
  //   <Button color="inherit" onClick={handleLogin}>
  //     Login
  //   </Button>
  // )

  const Header = styled(PageHeader)`
    background: ${mainColour};
    border-bottom: 1px solid ${mainColour[1]};
    .ant-page-header-heading-title {
      color: ${mainColour[5]};
    }
  `
  return (
    <Header
      className="site-page-header"
      onBack={() => null}
      title="Mitmeo Vault"
      subTitle="This is a subtitle"
      backIcon={false}
      extra={[
        <Button key="1" type="primary" onClick={() => login()}>
          Login
        </Button>,
      ]}
    />
  )
}

export default TopBar
