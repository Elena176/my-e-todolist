import {Dispatch} from 'redux';
import {authAPI, LoginParamsType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {clearTodolistsDataAC} from '../TodolistsList/todolists-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {setAppStatusAC} from '../../app/app-reducer';
import {requestStatus} from '../../enum/requestStatus';

const login = createAsyncThunk(
  'auth/login',
  async (param: LoginParamsType, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: requestStatus.loading}))
    try {
      const res = await authAPI.login(param)
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({status: requestStatus.succeeded}))
        return {isLoggedIn: true}
      } else {
        handleServerAppError(res.data,thunkAPI.dispatch)
        return {isLoggedIn: false}
      }
    } catch (err: any) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
     handleServerNetworkError(err,thunkAPI.dispatch )
      return {isLoggedIn: false}
    }
  }
)


const slice = createSlice({
  name: 'auth',
  initialState:  {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
      state.isLoggedIn = action.payload.value
    }
  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
    })
  }
})
export const authReducer = slice.reducer;
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC;

// thunks
/*const loginTC = createAsyncThunk(
  'auth'/'login',
  async (data: LoginParamsType, { handleServerNetworkError }) => {
    try {
      const response = await authAPI.login(data)
      return response.data
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return handleServerNetworkError(err.response.data)
    }
  }
)*/

export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  authAPI.login(data)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({value: true}))
        dispatch(setAppStatusAC({status: requestStatus.succeeded}))
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

export const logOutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  authAPI.logOut()
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({value: false}))
        dispatch(setAppStatusAC({status: requestStatus.succeeded}))
        dispatch(clearTodolistsDataAC())
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}


