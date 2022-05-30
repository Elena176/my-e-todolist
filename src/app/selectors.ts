import {AppRootStateType} from '../utils/types';
import {RequestStatusType} from './types';


export const selectStatus = (state: AppRootStateType):RequestStatusType => state.app.status;
export const selectIsInitialized = (state: AppRootStateType): boolean => state.app.isInitialized;

