import {FieldErrorType, LoginParamsType} from '../../api/types';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {clearTodolistsData} from '../TodolistsList/todolists-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {setAppStatus} from '../../app';
import {requestStatus} from '../../enum/requestStatus';
import {AxiosError} from 'axios';
import {authAPI} from '../../api';

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
        handleServerAppError(res.data, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldErrors})
      }
    } catch (err: any) {
      const error: AxiosError = err;
      handleServerNetworkError(error, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
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
        handleServerAppError(res.data, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({})
      }
    } catch (err: any) {
      handleServerNetworkError(err, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({})
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





