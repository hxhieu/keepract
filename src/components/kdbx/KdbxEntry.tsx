import React from 'react'
import { Entry } from 'kdbxweb'

export default ({
  entry,
  onSelect,
}: {
  entry: Entry
  onSelect: (entry: Entry) => void
}) => {
  const { fields } = entry
  const { Title } = fields
  return (
    <div></div>
    // <ListItem button onClick={() => onSelect(entry)}>
    //   <ListItemIcon>
    //     <KeyIcon />
    //   </ListItemIcon>
    //   <ListItemText primary={Title} />
    // </ListItem>
  )
}
