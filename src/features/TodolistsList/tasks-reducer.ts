import {
  addTodolistAC,
  clearTodolistsDataAC,
  removeTodolistAC,
  setTodolistsAC,
} from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {requestStatus} from '../../enum/requestStatus';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

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

export const removeTask = createAsyncThunk('tasks/removeTask', (param: { taskId: string, todolistId: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({status: requestStatus.loading}))
  return todolistsAPI.deleteTask(param.todolistId, param.taskId)
    .then(() => {
      thunkAPI.dispatch(setAppStatusAC({status: requestStatus.succeeded}))
      return {todolistId: param.todolistId, taskId: param.taskId}
    })
})

export const slice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {
    addTaskAC(state, action: PayloadAction<TaskType>) {
      state[action.payload.todoListId].unshift(action.payload)
    },
    updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
      const task = state[action.payload.todolistId]
      const index = task.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        task[index] = {...task[index], ...action.payload.model}
      }
    },
  },
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
  }
})
export const tasksReducer = slice.reducer;
export const { addTaskAC, updateTaskAC} = slice.actions;

// thunks

export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  todolistsAPI.createTask(todolistId, title)
    .then(res => {
      if (res.data.resultCode === 0) {
        const task = res.data.data.item
        const action = addTaskAC(task)
        dispatch(action)
        dispatch(setAppStatusAC({status: requestStatus.succeeded}))
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
  (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn('task not found in the state')
      return
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel
    }

    todolistsAPI.updateTask(todolistId, taskId, apiModel)
      .then(res => {
        if (res.data.resultCode === 0) {
          const action = updateTaskAC({taskId, model: domainModel, todolistId})
          dispatch(action)
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      })
  }


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

type ThunkDispatch = Dispatch
