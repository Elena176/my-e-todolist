import {AppRootStateType} from '../../utils/types';

export const selectIsLoggedIn = (state: AppRootStateType): boolean => state.auth.isLoggedIn;