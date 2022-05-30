import {FieldErrorType, LoginParamsType} from '../../api/types';
import {clearTodolistsData} from '../TodolistsList/todolists-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {setAppStatus} from '../../app';
import {requestStatus} from '../../enum/requestStatus';
import {authAPI} from '../../api';
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from '../../utils/error-utils';

const loginThunk = createAsyncThunk<undefined, LoginParamsType, {
  rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}>(
  'auth/login',
  async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: requestStatus.loading}))
    try {
      const res = await authAPI.login(param)
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({status: requestStatus.succeeded}))
        return;
      } else {
        return handleAsyncServerAppError(res.data, thunkAPI)
      }
    } catch (err: any) {
      return handleAsyncServerNetworkError(err, thunkAPI)
    }
  }
)

const logOut = createAsyncThunk(
  'auth/loginOut',
  async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: requestStatus.loading}))
    try {
      const res = await authAPI.logOut()
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({status: requestStatus.succeeded}))
        thunkAPI.dispatch(clearTodolistsData())
        return;
      } else {
        return handleAsyncServerAppError(res.data, thunkAPI);
      }
    } catch (err: any) {
      return handleAsyncServerNetworkError(err, thunkAPI);
    }
  }
)

export const asyncLoginActions = {
  loginThunk,
  logOut
}
export const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    }
  },
  extraReducers: builder => {
    builder.addCase(loginThunk.fulfilled, (state) => {
      state.isLoggedIn = true;
    })
    builder.addCase(logOut.fulfilled, (state) => {
      state.isLoggedIn = false;
    })
  }
})
export const loginReducer = slice.reducer;
export const setIsLoggedIn = slice.actions.setIsLoggedInAC;





