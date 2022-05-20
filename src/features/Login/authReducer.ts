import {Dispatch} from 'redux';
import {authAPI, LoginParamsType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {clearTodolistsDataAC} from '../TodolistsList/todolists-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {setAppStatusAC} from '../../app/app-reducer';
import {requestStatus} from '../../enum/requestStatus';

const initialState = {
  isLoggedIn: false
}
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


const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
      state.isLoggedIn = action.payload.value
    }
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


