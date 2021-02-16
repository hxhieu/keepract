import { PageHeader as Header } from 'antd'
import { ArrowLeftOutlined as BackIcon } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import styled from '@emotion/styled'
import { FC } from 'react'

interface PageHeaderProps {
  title: string
  disableBack?: boolean
}

const PageHeader: FC<PageHeaderProps> = (props) => {
  const { goBack } = useHistory()
  const { title, disableBack } = props
  return (
    <Header
      title={title}
      onBack={() => {
        goBack()
      }}
      backIcon={disableBack === true ? false : <BackIcon />}
    />
  )
}

export default PageHeader
