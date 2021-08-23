import { KdbxEntryField, ProtectedValue } from 'kdbxweb'

const getKdbxFieldValue = (value: KdbxEntryField | undefined) => {
  if (value instanceof ProtectedValue) {
    return value.getText()
  } else {
    return value
  }
}

export { getKdbxFieldValue }
