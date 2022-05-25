import {AppRootStateType} from './store';
import {RequestStatusType} from './app-reducer';

export const selectStatus = (state: AppRootStateType):RequestStatusType => state.app.status;
export const selectIsInitialized = (state: AppRootStateType): boolean => state.app.isInitialized;

