import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {requestStatus} from '../../enum/requestStatus';
import {handleServerNetworkError} from '../../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

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

export const removeTodolistThunk = createAsyncThunk('todolist/removeTodoLists', async (param:{todolistId: string}, {
  dispatch}) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  dispatch(changeTodolistEntityStatusAC({id: param.todolistId, status: requestStatus.loading}))
  await todolistsAPI.deleteTodolist(param.todolistId)
  dispatch(setAppStatusAC({status: requestStatus.succeeded}))
  return {id: param.todolistId};
})

export const addTodolistThunk = createAsyncThunk('todolist/addTodoLists', async(title: string, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(setAppStatusAC({status: requestStatus.loading}))
  try {
    const res = await todolistsAPI.createTodolist(title)
    dispatch(setAppStatusAC({status: requestStatus.succeeded}))
    return {todolist: res.data.data.item}
  }
  catch (error: any){
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
})

const slice = createSlice({
  name: 'todoLists',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].title = action.payload.title;
      // state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.status;
    },
    clearTodolistsDataAC() {
      return []
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchTodoLists.fulfilled, (state, action) => {
      return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: requestStatus.idle}))
    });
    builder.addCase(removeTodolistThunk.fulfilled, (state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if (index > -1) {
        state.splice(index, 1)
      }
    });
    builder.addCase(addTodolistThunk.fulfilled, (state, action) => {
      state.unshift({...action.payload.todolist, filter: 'all', entityStatus: requestStatus.idle})
    });
  }
})

export const todolistsReducer = slice.reducer

export const {
  changeTodolistEntityStatusAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  clearTodolistsDataAC
} = slice.actions;

// thunks

export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(id, title)
      .then(() => {
        dispatch(changeTodolistTitleAC({id, title}))
      })
  }
}

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
