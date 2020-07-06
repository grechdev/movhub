import { combineReducers } from 'redux'
import { userReducer } from './user'
import { loaderReducer } from './loader'

const rootReducer = combineReducers({
    user: userReducer,
    loader: loaderReducer,
})

export default rootReducer