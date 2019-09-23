import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Group } from 'kdbxweb'
import KdbxGroupIcon from './KdbxGroupIcon'
import KdbxEntry from './KdbxEntry'

export default ({ group }: { group: Group }) => {
  const { groups, entries } = group
  return (
    <>
      <List>
        {groups &&
          groups.map(x => (
            <ListItem button key={x.uuid.id}>
              <ListItemIcon>
                <KdbxGroupIcon idx={x.icon} />
              </ListItemIcon>
              <ListItemText
                primary={x.name}
                secondary={`${x.entries && x.entries.length} entries`}
              />
            </ListItem>
          ))}
        {entries && entries.map(x => <KdbxEntry entry={x} key={x.uuid.id} />)}
      </List>
    </>
  )
}
