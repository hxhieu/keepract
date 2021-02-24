import { Entry, ProtectedValue } from 'kdbxweb'
import React, { FC, useEffect, useState } from 'react'
import { Form, Input } from 'antd'
import { getKdbxFieldValue } from '../utils'

interface KdbxEntryFormProps {
  entry: Entry
}

interface EntryField {
  name: string
  value?: string
  type: 'input' | 'password'
}

const KdbxEntryForm: FC<KdbxEntryFormProps> = ({ entry }) => {
  const [fields, setFields] = useState<EntryField[]>([])

  useEffect(() => {
    const values: EntryField[] = []
    Object.keys(entry.fields).forEach((name) => {
      const field = entry.fields[name]
      values.push({
        name,
        value: getKdbxFieldValue(field),
        type: field instanceof ProtectedValue ? 'password' : 'input',
      })
      setFields(values)
    })
  }, [entry])

  return (
    <Form layout="vertical" size="large">
      {fields.map(
        (field) =>
          field.value && (
            <Form.Item label={field.name} key={field.name}>
              <Input value={field.value} type={field.type} readOnly />
            </Form.Item>
          )
      )}
    </Form>
  )
}

export default KdbxEntryForm
