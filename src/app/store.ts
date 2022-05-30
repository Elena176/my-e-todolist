import {tasksReducer, todolistsReducer} from '../features/TodolistsList';
import {combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {appReducer} from './'
import {loginReducer} from '../features/Login';
import {configureStore} from '@reduxjs/toolkit';
import {FieldErrorType} from '../api/todolists-api';

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: loginReducer,
})
// непосредственно создаём store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type RootReducerType = typeof rootReducer;
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<RootReducerType>
export type AppDispatchType = typeof store.dispatch;

export type ThunkError = {
  rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;

