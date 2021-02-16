import React, { FC } from 'react'
import { SmileTwoTone } from '@ant-design/icons'
import styled from '@emotion/styled'
import { primaryColour } from '../styles'

const Container = styled.div`
  text-align: center;
  padding: 20px;
`
const EmptyText = styled.label`
  font-size: 1.25em;
  svg {
    margin-right: 10px;
  }
`

const ProjectEmpty: FC = () => {
  return (
    <Container>
      <EmptyText>
        <SmileTwoTone twoToneColor={primaryColour} />
        You have no Project
      </EmptyText>
    </Container>
  )
}

export default ProjectEmpty
