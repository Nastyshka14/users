import { combineReducers, legacy_createStore as createStore} from 'redux'
import { composeWithDevTools } from "redux-devtools-extension";

import { users } from "./reducers/users";

export const store = createStore(combineReducers({ users }), composeWithDevTools())