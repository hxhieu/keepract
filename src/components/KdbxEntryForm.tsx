import { Entry } from 'kdbxweb'
import React, { FC } from 'react'
import { Form } from 'antd'

interface KdbxEntryFormProps {
  entry: Entry
}

const KdbxEntryForm: FC<KdbxEntryFormProps> = ({ entry }) => {
  return <Form />
}

export default KdbxEntryForm
