import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { PageHeader, Button, message } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useRecoilState } from 'recoil'
import styled from '@emotion/styled'
import { useAuthState } from 'react-firebase-hooks/auth'
import { accessTokenState } from '../state/shell'
import { getAuth, login, logout } from './Firebase'
import { primaryBorder, primaryBg, primaryColour } from '../styles'

const HomeButton = styled(HomeOutlined)`
  font-size: 1.5em;
  color: ${primaryColour};
`

const TopBar = () => {
  const { push } = useHistory()
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
      return setButtonLabel('Processing')
    }
    setButtonLabel(accessToken ? 'Logout' : 'Login')
  }, [startAuth, loading, accessToken])

  const Header = styled(PageHeader)`
    background: ${primaryBg};
    border-bottom: 1px solid ${primaryBorder};
    .ant-page-header-heading-title {
      color: ${primaryColour};
    }
  `
  return (
    <Header
      className="site-page-header"
      onBack={() => push('/')}
      title="Mitmeo Vault"
      subTitle={accessToken && user && user.email}
      backIcon={<HomeButton />}
      extra={[
        <Button
          key="1"
          danger={!loading && !!accessToken}
          type={startAuth || loading ? 'ghost' : 'default'}
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
