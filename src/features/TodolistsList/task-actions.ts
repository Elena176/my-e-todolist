import {createAsyncThunk} from '@reduxjs/toolkit';
import {setAppStatusAC} from '../../app/app-reducer';
import {requestStatus} from '../../enum/requestStatus';
import {TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {AxiosError} from 'axios';
import {AppRootStateType} from '../../app/store';
import {UpdateDomainTaskModelType} from './tasks-reducer';

export const fetchTasks = createAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>('tasks/fetchTasks', async (todolistId, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  try {
    const res = await todolistsAPI.getTasks(todolistId)
    const tasks = res.data.items
    dispatch(setAppStatusAC({status: requestStatus.succeeded}))
    return {tasks, todolistId}
  } catch (error: any) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
})
export const removeTask = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, todolistId: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({status: requestStatus.loading}))
  await todolistsAPI.deleteTask(param.todolistId, param.taskId)
  thunkAPI.dispatch(setAppStatusAC({status: requestStatus.succeeded}))
  return {todolistId: param.todolistId, taskId: param.taskId}
})
export const addTaskThunk = createAsyncThunk('tasks/addTask', async (param: { title: string, todolistId: string }, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  try {
    const res = await todolistsAPI.createTask(param.todolistId, param.title)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: requestStatus.succeeded}))
      return res.data.data.item;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (err: any) {
    const error: AxiosError = err;
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
})
export const updateTask = createAsyncThunk('tasks/updateTask', async (param: { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }, {
  dispatch,
  getState,
  rejectWithValue
}) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  const state = getState() as AppRootStateType
  const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
  if (!task) {
    //throw new Error("task not found in the state");
    return rejectWithValue('task not found in the state')
  }
  const apiModel: UpdateTaskModelType = {
    deadline: task.deadline,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    title: task.title,
    status: task.status,
    ...param.domainModel
  }
  try {
    const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: requestStatus.succeeded}))
      return param;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (err: any) {
    const error: AxiosError = err;
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
})