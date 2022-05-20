import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {fetchTasks} from './tasks-reducer';
import {requestStatus} from '../../enum/requestStatus';
import {handleServerNetworkError} from '../../utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
  name: 'todolists',
  initialState: initialState,
  reducers: {
    removeTodolistAC(state, action:PayloadAction<{id: string}>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if(index > -1) {
        state.splice(index, 1)
      }
      // state.filter(tl => tl.id !== action.id)
    },
    addTodolistAC(state, action:PayloadAction<{todolist: TodolistType}>) {
      state.unshift({...action.payload.todolist, filter: 'all', entityStatus: requestStatus.idle})
    },
    changeTodolistTitleAC(state, action:PayloadAction<{id: string, title: string}>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
     state[index].title = action.payload.title;
      // state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
    },
    changeTodolistFilterAC(state, action:PayloadAction<{id: string, filter: FilterValuesType}>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatusAC(state, action:PayloadAction<{id: string, status:  RequestStatusType}>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.status;
    },
    setTodolistsAC(state, action:PayloadAction<{todolists: Array<TodolistType>}>) {
      return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: requestStatus.idle}))
      // action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: requestStatus.idle}))
    },
    clearTodolistsDataAC() {return []}
  }
})

export const todolistsReducer = slice.reducer

export const {setTodolistsAC, changeTodolistEntityStatusAC, removeTodolistAC, addTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, clearTodolistsDataAC} = slice.actions;

// thunks
export const fetchTodolistsTC = () => {
  return (dispatch: any) => {
    dispatch(setAppStatusAC({status: requestStatus.loading}))
    todolistsAPI.getTodolists()
      .then((res) => {
        dispatch(setTodolistsAC({todolists: res.data}))
        dispatch(setAppStatusAC({status: requestStatus.succeeded}))
        return res.data
      })
      .then((todos) => {
        todos.forEach(tl => {
          dispatch(fetchTasks(tl.id))
        })
      })
  }
}
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: Dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatusAC({status: requestStatus.loading}))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status:  requestStatus.loading}))
    todolistsAPI.deleteTodolist(todolistId)
      .then(() => {
        dispatch(removeTodolistAC({id: todolistId}))
        //скажем глобально приложению, что асинхронная операция завершена
        dispatch(setAppStatusAC({status: requestStatus.succeeded}))
      })
  }
}
export const addTodolistTC = (title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: requestStatus.loading}))
    todolistsAPI.createTodolist(title)
      .then((res) => {
        dispatch(addTodolistAC({todolist: res.data.data.item}))
        dispatch(setAppStatusAC({status: requestStatus.succeeded}))
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(id, title)
      .then(() => {
        dispatch(changeTodolistTitleAC({id, title}))
      })
  }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type ClearTodolistsDataActionType = ReturnType<typeof clearTodolistsDataAC>;

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
