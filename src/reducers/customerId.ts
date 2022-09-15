const isLogged = (state = null, action: any) => {
  switch (action.type) {
    case 'SET_CUSTOMER_ID':
      return action.payload
    case 'GET_CUSTOMER_ID':
      return state
    default:
      return state
  }
}
export default isLogged
