import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {requestStatus} from '../../enum/requestStatus';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {handleServerNetworkError} from '../../utils/error-utils';


const fetchTodoLists = createAsyncThunk('todolist/fetchTodoLists', async (param, {
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
const removeTodolist = createAsyncThunk('todolist/removeTodoLists', async (param: { todolistId: string }, {
  dispatch
}) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  dispatch(changeTodolistEntityStatus({id: param.todolistId, status: requestStatus.loading}))
  await todolistsAPI.deleteTodolist(param.todolistId)
  dispatch(setAppStatusAC({status: requestStatus.succeeded}))
  return {id: param.todolistId};
})
const addTodolist = createAsyncThunk('todolist/addTodoLists', async (title: string, {
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
const changeTodolistTitle = createAsyncThunk('todolist/changeTodolistTitle', async (param: { id: string, title: string }, {
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
      return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: requestStatus.idle}))
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

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
