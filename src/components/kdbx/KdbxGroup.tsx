import React, { useState } from 'react'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Group, Entry } from 'kdbxweb'
import KdbxGroupIcon from './KdbxGroupIcon'
import KdbxEntry from './KdbxEntry'
import KdbxEntryDetails from './KdbxEntryDetails'

interface IEntryForm {
  entry?: Entry
  open: boolean
}

export default ({ group }: { group: Group }) => {
  const [entryForm, setEntryForm] = useState<IEntryForm>({
    entry: undefined,
    open: false
  })

  const { groups, entries } = group
  const { entry, open } = entryForm
  console.log(entry)
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
        {entries &&
          entries.map(x => (
            <KdbxEntry
              entry={x}
              key={x.uuid.id}
              onSelect={entry =>
                setEntryForm({
                  entry,
                  open: true
                })
              }
            />
          ))}
      </List>
      <KdbxEntryDetails
        open={open}
        entry={entry}
        onClose={() => {
          setEntryForm({
            entry: undefined,
            open: false
          })
        }}
      />
    </>
  )
}
