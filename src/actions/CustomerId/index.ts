export const setCustomerId = (payload: any) => {
  return {
    type: 'SET_CUSTOMER_ID',
    payload,
  }
}
export const getCustomerId = () => {
  return {
    type: 'GET_CUSTOMER_ID',
  }
}
