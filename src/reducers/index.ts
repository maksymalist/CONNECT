import { combineReducers } from 'redux'
import plan from './plan'
import isLogged from './islogged'
import customerId from './customerId'

const rootReducer = combineReducers({
  customerId: customerId,
  plan: plan,
  isLogged: isLogged,
})
export default rootReducer
