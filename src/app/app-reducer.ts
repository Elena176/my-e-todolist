import {Dispatch} from 'redux';
import {authAPI} from '../api/todolists-api';
import {setIsLoggedInAC} from '../features/Login/authReducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {requestStatus} from '../enum/requestStatus';

const initialState: InitialStateType = {
  status: requestStatus.idle,
  error: null,
  isInitialized: false,
}
const slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setIsInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
      state.isInitialized = action.payload.isInitialized
    }
  }
})
export const appReducer = slice.reducer;

export type RequestStatusType = requestStatus;
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null
  isInitialized: boolean
}

export const {setIsInitializedAC, setAppErrorAC, setAppStatusAC} = slice.actions;

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me()
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({value: true}));
      } else {
      }
    })
    .finally(() => {
      dispatch(setIsInitializedAC({isInitialized: true}))
    })
}

