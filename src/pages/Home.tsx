import { FC } from 'react'
import { useRecoilValue } from 'recoil'
import { accessTokenState } from '../state/shell'
import ProjectList from '../containers/ProjectList'
import PageHeader from '../components/common/PageHeader'

const Home: FC = () => {
  const accessToken = useRecoilValue(accessTokenState)
  return accessToken ? (
    <ProjectList />
  ) : (
    <PageHeader>You are not logged in.</PageHeader>
  )
}

export default Home
