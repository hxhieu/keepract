import React from 'react'
import KeyIcon from '@material-ui/icons/VpnKey'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Entry } from 'kdbxweb'

export default ({
  entry,
  onSelect
}: {
  entry: Entry
  onSelect: (entry: Entry) => void
}) => {
  const { fields } = entry
  const { Title } = fields
  return (
    <ListItem button onClick={() => onSelect(entry)}>
      <ListItemIcon>
        <KeyIcon />
      </ListItemIcon>
      <ListItemText primary={Title} />
    </ListItem>
  )
}
