import {clearTodolistsData, } from './todolists-reducer'
import {
  FieldErrorType,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType
} from '../../api/todolists-api'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setAppStatusAC} from '../../app/app-reducer';
import {requestStatus} from '../../enum/requestStatus';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {AxiosError} from 'axios';
import {AppRootStateType} from '../../app/store';
import {asyncActions} from './todolists-reducer'

const fetchTasks = createAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>('tasks/fetchTasks', async (todolistId, {
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
const removeTask = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, todolistId: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({status: requestStatus.loading}))
  await todolistsAPI.deleteTask(param.todolistId, param.taskId)
  thunkAPI.dispatch(setAppStatusAC({status: requestStatus.succeeded}))
  return {todolistId: param.todolistId, taskId: param.taskId}
})
const addTask = createAsyncThunk<TaskType, { title: string, todolistId: string },{
  rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
} >('tasks/addTask', async (param, {dispatch,
  rejectWithValue}) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  try {
    const res = await todolistsAPI.createTask(param.todolistId, param.title)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: requestStatus.succeeded}))
      return res.data.data.item;
    } else {
      handleServerAppError(res.data, dispatch, false)
      return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldErrors});
    }
  } catch (err: any) {
    const error: AxiosError = err;
    handleServerNetworkError(error, dispatch, false)
    return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
  }
})
const updateTask = createAsyncThunk('tasks/updateTask', async (param: { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }, {
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

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}