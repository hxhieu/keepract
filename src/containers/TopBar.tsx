import React, { useEffect, useState } from 'react'
import { PageHeader, Button, message } from 'antd'
import { useRecoilState } from 'recoil'
import { geekblue as mainColour } from '@ant-design/colors'
import styled from '@emotion/styled'
import { useAuthState } from 'react-firebase-hooks/auth'
import { accessTokenState } from '../state/shell'
import { getAuth, login, logout } from './Firebase'

const TopBar = () => {
  const [user, loading, error] = useAuthState(getAuth())
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const [startAuth, setStartAuth] = useState<boolean>(false)
  const [buttonLabel, setButtonLabel] = useState<string>()

  const handleLoginOutButton = () => {
    if (accessToken) {
      setAccessToken(undefined)
      logout()
    } else {
      setStartAuth(true)
      login()
    }
  }

  useEffect(() => {
    if (error) {
      message.error(error)
    }
  }, [error])

  useEffect(() => {
    if (startAuth || loading) {
      return setButtonLabel('')
    }
    setButtonLabel(accessToken ? 'Logout' : 'Login')
  }, [startAuth, loading, accessToken])

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
      subTitle={user && user.email}
      backIcon={false}
      extra={[
        <Button
          key="1"
          danger={!loading && !!accessToken}
          type={startAuth || loading ? 'default' : 'primary'}
          loading={startAuth || loading}
          onClick={handleLoginOutButton}
        >
          {buttonLabel}
        </Button>,
      ]}
    />
  )
}

export default TopBar
