import * as appSelectors from './selectors';
import {setAppStatus, setAppError, slice} from './app-reducer'

const asyncInitializeActions = slice.actions
const appReducer = slice.reducer

export {
  appSelectors,
  appReducer,
  setAppStatus,
  setAppError,
  asyncInitializeActions
}