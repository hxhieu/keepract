export default (state, action) => {
  const { type, message } = action.payload
  console.log(message)
  switch (action.type) {
    case 'SHOW_ALERT':
      return {
        ...state,
        type,
        message
      }
    default:
      return state
  }
}
