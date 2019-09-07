import React from 'react'
import InboxIcon from '@material-ui/icons/Inbox'
import styled from '@emotion/styled'
import { useTheme } from '@material-ui/styles'
import { Button } from '@material-ui/core'

const Container = styled.div({
  textAlign: 'center'
})

const EmptyText = styled.label(
  {
    display: 'block',
    marginBottom: '12px'
  },
  props => ({
    color: props.color
  })
)

export default () => {
  const {
    palette: { text }
  } = useTheme()
  console.log(text)
  return (
    <Container>
      <InboxIcon fontSize="large" color="disabled"></InboxIcon>
      <EmptyText color={text.disabled}>You have no Project</EmptyText>
      <Button variant="contained" color="primary">
        Create one now!
      </Button>
    </Container>
  )
}
