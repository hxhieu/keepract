import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div({
  textAlign: 'center',
})

const EmptyText = styled.label(
  {
    display: 'block',
    marginBottom: '12px',
  },
  (props) => ({
    color: props.color,
  })
)

export default () => {
  return <div></div>
  // const {
  //   palette: { text }
  // } = useTheme()
  // return (
  //   <Container>
  //     <InboxIcon fontSize="large" color="disabled"></InboxIcon>
  //     <EmptyText color={text.disabled}>You have no Project</EmptyText>
  //   </Container>
  // )
}
