import * as appSelectors from './selectors';
import {appReducer, setAppStatusAC, RequestStatusType as T1} from './app-reducer'

export type RequestStatusType = T1

export {
  appSelectors,
  appReducer,
  setAppStatusAC
}