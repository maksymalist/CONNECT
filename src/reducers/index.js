import { combineReducers } from 'redux'

import plan from './plan'
import isLogged from './islogged'

const rootReducer = combineReducers({
    "plan": plan,
    "isLogged": isLogged
})

export default rootReducer