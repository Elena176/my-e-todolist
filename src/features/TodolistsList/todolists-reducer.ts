import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {fetchTasksTC} from './tasks-reducer';
import {requestStatus} from '../../enum/requestStatus';

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
  switch (action.type) {
    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.id)
    case 'ADD-TODOLIST':
      return [{...action.todolist, filter: 'all', entityStatus: requestStatus.idle}, ...state]

    case 'CHANGE-TODOLIST-TITLE':
      return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
    case 'CHANGE-TODOLIST-FILTER':
      return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
    case 'CHANGE-TODOLIST-ENTITY-STATUS':
      return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status.status} : tl)
    case 'SET-TODOLISTS':
      return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: requestStatus.idle}))
    case 'CLEAR-TODOLIST-DATA':
      return []
    default:
      return state
  }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
  type: 'CHANGE-TODOLIST-TITLE',
  id,
  title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
  type: 'CHANGE-TODOLIST-FILTER',
  id,
  filter
} as const)
export const changeTodolistEntityStatusAC = (id: string, status: {status: RequestStatusType}) => ({
  type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
export const clearTodolistsDataAC = () => ({type: 'CLEAR-TODOLIST-DATA'} as const)

// thunks
export const fetchTodolistsTC = () => {
  return (dispatch: any) => {
    dispatch(setAppStatusAC({status: requestStatus.loading}))
    todolistsAPI.getTodolists()
      .then((res) => {
        dispatch(setTodolistsAC(res.data))
        dispatch(setAppStatusAC({status: requestStatus.succeeded}))
        return res.data
      })
      .then((todos) => {
        todos.forEach(tl => {
          dispatch(fetchTasksTC(tl.id))
        })
      })
  }
}
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: Dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatusAC({status: requestStatus.loading}))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatusAC(todolistId, {status: requestStatus.loading}))
    todolistsAPI.deleteTodolist(todolistId)
      .then(() => {
        dispatch(removeTodolistAC(todolistId))
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
        dispatch(addTodolistAC(res.data.data.item))
        dispatch(setAppStatusAC({status: requestStatus.succeeded}))
      })
  }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.updateTodolist(id, title)
      .then(() => {
        dispatch(changeTodolistTitleAC(id, title))
      })
  }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type ClearTodolistsDataActionType = ReturnType<typeof clearTodolistsDataAC>;
type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | SetTodolistsActionType
  | ReturnType<typeof changeTodolistEntityStatusAC>
| ClearTodolistsDataActionType
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
