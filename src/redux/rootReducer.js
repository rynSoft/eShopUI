// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import refreshData from './refreshData'
const rootReducer = {
  auth,
  navbar,
  layout,
  refreshData,
}

export default rootReducer
