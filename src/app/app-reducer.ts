import {authAPI} from '../api';
import {setIsLoggedIn} from '../features/Login/loginReducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {requestStatus} from '../enum/requestStatus';

const initializeApp = createAsyncThunk(
  'app/initializeApp',
  async (param, {dispatch}) => {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn({value: true}));
    } else {
    }
  }
)

export const asyncInitializeActions = {
  initializeApp
}
export const slice = createSlice({
  name: 'app',
  initialState: {
    status: requestStatus.idle,
    error: null,
    isInitialized: false,
  } as InitialStateType,
  reducers: {
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    }
  },
  extraReducers: builder => {
    builder.addCase(initializeApp.fulfilled,(state) => {
      state.isInitialized = true;
    })
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

export const {setAppError, setAppStatus} = slice.actions;



