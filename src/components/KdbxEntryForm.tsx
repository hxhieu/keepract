import { Entry, ProtectedValue } from 'kdbxweb'
import React, { FC, useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Form, Input, InputProps, message } from 'antd'
import styled from '@emotion/styled'
import { getKdbxFieldValue } from '../utils'
import { CopyTwoTone } from '@ant-design/icons'
import { primaryBg } from '../styles'

interface KdbxEntryFormProps {
  entry: Entry
}

interface EntryField {
  name: string
  value?: string
  type: 'input' | 'password'
}

const EntryForm = styled(Form)`
  .ant-input-group-addon {
    padding: 0;
  }
`

const CopyButton = styled.span`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background: ${primaryBg};
  }
`

const KdbxEntryForm: FC<KdbxEntryFormProps> = ({ entry }) => {
  const [fields, setFields] = useState<EntryField[]>([])

  const { error, success } = message

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

  const renderInput = (field: EntryField) => {
    const props: InputProps = {
      readOnly: true,
      value: field.value,
      addonAfter: (
        <CopyToClipboard
          text={field.value || ''}
          onCopy={(_, result) => {
            if (result) {
              success(`${field.name} copied!`)
            } else {
              error('Failed to copy...')
            }
          }}
        >
          <CopyButton>
            <CopyTwoTone />
          </CopyButton>
        </CopyToClipboard>
      ),
    }

    return field.type == 'password' ? (
      <Input.Password {...props} />
    ) : (
      <Input {...props} />
    )
  }

  return (
    <EntryForm layout="vertical" size="large">
      {fields.map(
        (field) =>
          field.value && (
            <Form.Item label={field.name} key={field.name}>
              {renderInput(field)}
            </Form.Item>
          )
      )}
    </EntryForm>
  )
}

export default KdbxEntryForm
