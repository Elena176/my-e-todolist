import {createAsyncThunk} from '@reduxjs/toolkit';
import {setAppStatusAC} from '../../app/app-reducer';
import {requestStatus} from '../../enum/requestStatus';
import {todolistsAPI} from '../../api/todolists-api';
import {handleServerNetworkError} from '../../utils/error-utils';
import {changeTodolistEntityStatusAC} from './todolists-reducer';

export const fetchTodoLists = createAsyncThunk('todolist/fetchTodoLists', async (param, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  const res = await todolistsAPI.getTodolists()
  try {
    dispatch(setAppStatusAC({status: requestStatus.succeeded}))
    return {todoLists: res.data}
  } catch (error: any) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
})
export const removeTodolistThunk = createAsyncThunk('todolist/removeTodoLists', async (param: { todolistId: string }, {
  dispatch
}) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  dispatch(changeTodolistEntityStatusAC({id: param.todolistId, status: requestStatus.loading}))
  await todolistsAPI.deleteTodolist(param.todolistId)
  dispatch(setAppStatusAC({status: requestStatus.succeeded}))
  return {id: param.todolistId};
})
export const addTodolistThunk = createAsyncThunk('todolist/addTodoLists', async (title: string, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  try {
    const res = await todolistsAPI.createTodolist(title)
    dispatch(setAppStatusAC({status: requestStatus.succeeded}))
    return {todolist: res.data.data.item}
  } catch (error: any) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
})
export const changeTodolistTitleThunk = createAsyncThunk('todolist/changeTodolistTitle', async (param: { id: string, title: string }, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  try {
    await todolistsAPI.updateTodolist(param.id, param.title)
    dispatch(setAppStatusAC({status: requestStatus.succeeded}))
    return {id: param.id, title: param.title}
  } catch (error: any) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
})