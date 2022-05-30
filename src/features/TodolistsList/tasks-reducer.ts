import {asyncActions, clearTodolistsData,} from './todolists-reducer'
import {TaskType, UpdateTaskModelType} from '../../api/types'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setAppStatus} from '../../app';
import {requestStatus} from '../../enum/requestStatus';
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from '../../utils/error-utils';
import {AppRootStateType, ThunkError} from '../../utils/types';
import {todolistsAPI} from '../../api';
import {TasksStateType, UpdateDomainTaskModelType} from './Todolist/types';

const fetchTasks = createAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>('tasks/fetchTasks', async (todolistId, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: requestStatus.loading}))
  try {
    const res = await todolistsAPI.getTasks(todolistId)
    const tasks = res.data.items
    thunkAPI.dispatch(setAppStatus({status: requestStatus.succeeded}))
    return {tasks, todolistId}
  } catch (error: any) {
    return handleAsyncServerNetworkError(error, thunkAPI, false)
  }
})

const removeTask = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, todolistId: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: requestStatus.loading}))
  await todolistsAPI.deleteTask(param.todolistId, param.taskId)
  thunkAPI.dispatch(setAppStatus({status: requestStatus.succeeded}))
  return {todolistId: param.todolistId, taskId: param.taskId}
})
const addTask = createAsyncThunk<TaskType, { title: string, todolistId: string }, ThunkError>('tasks/addTask', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: requestStatus.loading}))
  try {
    const res = await todolistsAPI.createTask(param.todolistId, param.title)
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({status: requestStatus.succeeded}))
      return res.data.data.item;
    } else {
      handleAsyncServerAppError(res.data, thunkAPI, false)
      return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldErrors});
    }
  } catch (err: any) {
    return handleAsyncServerNetworkError(err, thunkAPI, false)
  }
})

const updateTask = createAsyncThunk('tasks/updateTask', async (param: { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: requestStatus.loading}))
  const state = thunkAPI.getState() as AppRootStateType
  const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
  if (!task) {
    //throw new Error("task not found in the state");
    return thunkAPI.rejectWithValue('task not found in the state')
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
      thunkAPI.dispatch(setAppStatus({status: requestStatus.succeeded}))
      return param;
    } else {
      return handleAsyncServerAppError(res.data, thunkAPI);
    }
  } catch (err: any) {
    return handleAsyncServerNetworkError(err, thunkAPI)
  }
})

export const asyncTaskActions = {
  fetchTasks,
  removeTask,
  addTask,
  updateTask
}

export const slice = createSlice({
  name: 'tasks',
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncActions.addTodolist.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = []
    });
    builder.addCase(asyncActions.removeTodolist.fulfilled, (state, action) => {
      delete state[action.payload.id]
    });
    builder.addCase(asyncActions.fetchTodoLists.fulfilled, (state, action) => {
      action.payload.todoLists.forEach((tl: any) => state[tl.id] = [])
    });
    builder.addCase(clearTodolistsData, () => {
      return {}
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const task = state[action.payload.todolistId]
      const index = task.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        task.splice(index, 1)
      }
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      state[action.payload.todoListId].unshift(action.payload)
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const task = state[action.payload.todolistId]
      const index = task.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        task[index] = {...task[index], ...action.payload.domainModel}
      }
    })
  }
})

export const tasksReducer = slice.reducer;
