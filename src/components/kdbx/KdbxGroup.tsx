import React, { useState } from 'react'
import { Group, Entry } from 'kdbxweb'
import KdbxGroupIcon from './KdbxGroupIcon'
import KdbxEntry from './KdbxEntry'
import KdbxEntryDetails from './KdbxEntryDetails'
import KdbxGroupPopup from './KdbxGroupPopup'

interface IEntryForm {
  entry?: Entry
  open: boolean
}

export default ({ group }: { group: Group }) => {
  const [entryForm, setEntryForm] = useState<IEntryForm>({
    entry: undefined,
    open: false,
  })
  const [subGroup, setSubgroup] = useState<Group>()

  const { groups, entries } = group
  const { entry, open } = entryForm
  return (
    <>
      {/* <List>
        {groups &&
          groups.map(x => (
            <ListItem button key={x.uuid.id} onClick={() => setSubgroup(x)}>
              <ListItemIcon>
                <KdbxGroupIcon idx={x.icon} />
              </ListItemIcon>
              <ListItemText
                primary={x.name}
                secondary={
                  <>
                    {x.entries.length > 0 && (
                      <Chip
                        avatar={
                          <Avatar component="span">
                            <KeyIcon />
                          </Avatar>
                        }
                        color="primary"
                        component="a"
                        label={x.entries.length}
                        size="small"
                      ></Chip>
                    )}
                    {x.groups.length > 0 && (
                      <Chip
                        avatar={
                          <Avatar component="span">
                            <FolderIcon />
                          </Avatar>
                        }
                        component="a"
                        label={x.groups.length}
                        size="small"
                      ></Chip>
                    )}
                  </>
                }
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
      <KdbxGroupPopup
        open={!!subGroup}
        group={subGroup}
        onClose={() => setSubgroup(undefined)}
      /> */}
    </>
  )
}
