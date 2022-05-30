import {TodolistType} from '../../api/types'
import {todolistsAPI} from '../../api'
import {RequestStatusType, setAppStatus} from '../../app'
import {requestStatus} from '../../enum/requestStatus';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  handleAsyncServerAppError,
  handleAsyncServerNetworkError,
} from '../../utils/error-utils';
import {ThunkError} from '../../utils/types';
import {FilterValuesType, TodolistDomainType} from './types';


const fetchTodoLists = createAsyncThunk('todolist/fetchTodoLists', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: requestStatus.loading}))
  const res = await todolistsAPI.getTodolists()
  try {
    thunkAPI.dispatch(setAppStatus({status: requestStatus.succeeded}))
    return {todoLists: res.data}
  } catch (error: any) {
    return handleAsyncServerNetworkError(error, thunkAPI)
  }
})

const removeTodolist = createAsyncThunk('todolist/removeTodoLists', async (param: { todolistId: string }, {
  dispatch
}) => {
  dispatch(setAppStatus({status: requestStatus.loading}))
  dispatch(changeTodolistEntityStatus({id: param.todolistId, status: requestStatus.loading}))
  await todolistsAPI.deleteTodolist(param.todolistId)
  dispatch(setAppStatus({status: requestStatus.succeeded}))
  return {id: param.todolistId};
})

const addTodolist = createAsyncThunk<{todolist: TodolistType}, string, ThunkError>('todolist/addTodoLists', async (title, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: requestStatus.loading}))
  try {
    const res = await todolistsAPI.createTodolist(title)
    if(res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({status: requestStatus.succeeded}))
      return {todolist: res.data.data.item}
    } else {
      return handleAsyncServerAppError(res.data, thunkAPI)
    }
  } catch (err: any) {
    return handleAsyncServerNetworkError(err, thunkAPI, false)
  }
})
const changeTodolistTitle = createAsyncThunk('todolist/changeTodolistTitle', async (param: { id: string, title: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: requestStatus.loading}))
  try {
    const res = await todolistsAPI.updateTodolist(param.id, param.title)
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({status: requestStatus.succeeded}))
      return {id: param.id, title: param.title}
    } else {
     return handleAsyncServerAppError(res.data, thunkAPI)
    }
  } catch (error: any) {
   return handleAsyncServerNetworkError(error, thunkAPI, false)
  }
})

export const asyncActions = {
  fetchTodoLists,
  removeTodolist,
  addTodolist,
  changeTodolistTitle
}
export const slice = createSlice({
  name: 'todoLists',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.status;
    },
    clearTodolistsData() {
      return []
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchTodoLists.fulfilled, (state, action) => {
      return action.payload.todoLists.map((tl: any) => ({...tl, filter: 'all', entityStatus: requestStatus.idle}))
    });
    builder.addCase(removeTodolist.fulfilled, (state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if (index > -1) {
        state.splice(index, 1)
      }
    });
    builder.addCase(addTodolist.fulfilled, (state, action) => {
      state.unshift({...action.payload.todolist, filter: 'all', entityStatus: requestStatus.idle})
    });
    builder.addCase(changeTodolistTitle.fulfilled, (state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].title = action.payload.title;
    });
  }
})

export const todolistsReducer = slice.reducer

export const {
  changeTodolistEntityStatus,
  changeTodolistFilter,
  clearTodolistsData
} = slice.actions;

