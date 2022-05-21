import {Dispatch} from 'redux';
import {authAPI, LoginParamsType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {clearTodolistsDataAC} from '../TodolistsList/todolists-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {setAppStatusAC} from '../../app/app-reducer';
import {requestStatus} from '../../enum/requestStatus';
import {AxiosError} from 'axios';

export const login = createAsyncThunk(
  'auth/login',
  async (param: LoginParamsType, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: requestStatus.loading}))
    try {
      const res = await authAPI.login(param)
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({status: requestStatus.succeeded}))
        return {isLoggedIn: true}
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({error: res.data.messages, fieldsErrors: res.data.fieldsErrors})
      }
    } catch (err: any) {
      const error: AxiosError = err;
      handleServerNetworkError(error, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
  }
)


const slice = createSlice({
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
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })
  }
})
export const authReducer = slice.reducer;
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC;

// thunks

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


