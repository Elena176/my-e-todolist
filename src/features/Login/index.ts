import * as loginSelectors from './selectors';
import {Login, } from './Login'
import {asyncLoginActions as asyncActions, slice} from './loginReducer';

const loginActions = {
  ...asyncActions,
  ...slice.actions
}
export {
  loginSelectors,
  Login,
  loginActions
}