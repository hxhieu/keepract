import React, { FC } from 'react'
import { PageHeader as AntPageHeader, Spin } from 'antd'
import { ArrowLeftOutlined as BackIcon } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import styled from '@emotion/styled'

interface PageHeaderProps {
  title: string
  disableBack?: boolean
  loading?: boolean
}

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Header = styled(AntPageHeader)`
  padding-left: 0;
  padding-right: 0;
`

const PageHeader: FC<PageHeaderProps> = ({ title, disableBack, loading }) => {
  const { goBack } = useHistory()
  return (
    <HeaderWrapper>
      <Header
        title={title}
        onBack={() => {
          goBack()
        }}
        backIcon={disableBack === true ? false : <BackIcon />}
      />
      {loading && <Spin size="small" />}
    </HeaderWrapper>
  )
}

export default PageHeader
