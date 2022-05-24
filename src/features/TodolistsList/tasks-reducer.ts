import {addTodolistAC, clearTodolistsDataAC, removeTodolistAC, setTodolistsAC,} from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {AppRootStateType} from '../../app/store'
import {setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {requestStatus} from '../../enum/requestStatus';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';

const initialState: TasksStateType = {}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', (todolistId: string, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({status: requestStatus.loading}))
  return todolistsAPI.getTasks(todolistId)
    .then((res) => {
      const tasks = res.data.items
      thunkAPI.dispatch(setAppStatusAC({status: requestStatus.succeeded}))
      return {tasks, todolistId}
    })
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

export const updateTask = createAsyncThunk('tasks/updateTask', async (param: { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string}, {
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

export const slice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    });
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.id]
    });
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach(tl => state[tl.id] = [])
    });
    builder.addCase(clearTodolistsDataAC, () => {
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
    builder.addCase(addTaskThunk.fulfilled, (state, action) => {
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