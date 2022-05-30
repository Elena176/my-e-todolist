import * as appSelectors from './selectors';
import {setAppStatus, setAppError,RequestStatusType as T1, slice} from './app-reducer'

export type RequestStatusType = T1
const asyncInitializeActions = slice.actions
const appReducer = slice.reducer

export {
  appSelectors,
  appReducer,
  setAppStatus,
  setAppError,
  asyncInitializeActions
}