import {FieldErrorType} from '../api/todolists-api';
import {rootReducer, store} from '../app/store';

export type RootReducerType = typeof rootReducer;
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<RootReducerType>
export type AppDispatchType = typeof store.dispatch;

export type ThunkError = {
  rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}
