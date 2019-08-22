import React from 'react'
import { Button } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

function Home() {
  const theme = useTheme()
  return (
    <>
      <h1>Home</h1>
      <Button variant="contained" color="primary">
        {theme.palette.primary.main}
      </Button>
    </>
  )
}

export default Home
