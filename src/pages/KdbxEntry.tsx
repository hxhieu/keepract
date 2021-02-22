import React, { FC } from 'react'

interface KdbxEntryRouteParams {
  uuid: string
  groupIds?: string
  entryId: string
}

const KdbxEntry: FC = () => {
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

export default KdbxEntry
