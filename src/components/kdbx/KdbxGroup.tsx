import { Entry, Group } from 'kdbxweb'
import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, List } from 'antd'
import {
  FolderOpenTwoTone,
  FolderTwoTone,
  LockTwoTone,
} from '@ant-design/icons'
import PageHeader from '../common/PageHeader'
import styled from '@emotion/styled'

interface KdbxGroupProps {
  group?: Group
}

interface KdbxItem {
  name: string
  notes?: string
  uuid?: string
  isGroup: boolean
}

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const KdbxGroup: FC<KdbxGroupProps> = ({ group }) => {
  if (!group) return <h2>Invalid group</h2>
  const { groups, entries } = group
  const items: KdbxItem[] = []

  groups.forEach((x) => {
    items.push({
      name: x.name as string,
      uuid: x.uuid.id,
      isGroup: true,
    })
  })

  entries.forEach((x) => {
    const { fields, uuid } = x
    const { Title, Notes } = fields
    items.push({
      name: Title as string,
      notes: Notes as string,
      uuid: uuid.id,
      isGroup: false,
    })
  })

  return (
    <Wrapper>
      <List
        bordered
        dataSource={items}
        renderItem={({ name, uuid, isGroup, notes }) => (
          <List.Item
            actions={[
              <Button type="default" icon={<FolderOpenTwoTone />}>
                Open
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={isGroup ? <FolderTwoTone /> : <LockTwoTone />}
              description={notes}
              title={name}
            />
          </List.Item>
        )}
      />
    </Wrapper>
  )
}

export default KdbxGroup
