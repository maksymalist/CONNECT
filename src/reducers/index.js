import { combineReducers } from 'redux'

import counter from './counter'
import plan from './plan'

const rootReducer = combineReducers({
    "counter": counter,
    "plan": plan
})

export default rootReducer