import React from 'react'
// import { CircularProgress } from '@material-ui/core'
import styled from '@emotion/styled'

const Loader = styled.div({
  padding: '20px',
  textAlign: 'center',
})

export default ({ loading }: { loading: boolean }) => {
  return loading ? (
    <Loader>{/* <CircularProgress size={70} /> */}</Loader>
  ) : null
}
