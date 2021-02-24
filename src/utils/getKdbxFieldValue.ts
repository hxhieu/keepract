import { ProtectedValue, StringProtected } from 'kdbxweb'

const getKdbxFieldValue = (value: StringProtected) => {
  if (value instanceof ProtectedValue) {
    return value.getText()
  } else {
    return value
  }
}

export { getKdbxFieldValue }
