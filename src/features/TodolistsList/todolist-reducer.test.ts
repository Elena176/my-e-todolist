import {TodolistType} from '../../api/todolists-api';
import {
  addTodolistAC,
  changeTodolistEntityStatusAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  FilterValuesType,
  removeTodolistAC,
  setTodolistsAC,
  TodolistDomainType,
  todolistsReducer
} from './todolists-reducer';
import {v1} from 'uuid';
import {RequestStatusType} from '../../app/app-reducer';
import {requestStatus} from '../../enum/requestStatus';

let todoListId1: string
let todoListId2: string

let startState: TodolistDomainType[] = []

beforeEach(() => {
  todoListId1 = v1();
  todoListId2 = v1();
  startState = [
    {id: todoListId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: requestStatus.idle},
    {id: todoListId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: requestStatus.idle}
  ]
})
test('correct todolist should be removed', () => {
  const endState = todolistsReducer(startState, removeTodolistAC(todoListId1))
  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todoListId2)
});

test('correct todolist should be added', () => {
  let newTodolist:TodolistType = {
    id: 'todoListId3',
    title: 'New Todolist',
    addedDate: '',
    order: 0
  }
  const endState = todolistsReducer(startState, addTodolistAC(newTodolist))
  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe('New Todolist')
})

test('correct title of todolist should be changed', () => {
  let newTodoListTitle = 'New Todolist'
  const endState = todolistsReducer(startState, changeTodolistTitleAC(todoListId2, newTodoListTitle))
  expect(endState[1].title).toBe(newTodoListTitle)
  expect(endState[0].title).toBe('What to learn')
})

test('correct filter of todolist should be changed', () => {
let newFilter: FilterValuesType = 'completed'
  const endState = todolistsReducer(startState, changeTodolistFilterAC(todoListId2, newFilter))
  expect(endState[1].filter).toBe(newFilter)
  expect(endState[0].filter).toBe('all')
})

test('todoLists should be added', () => {
  const endState = todolistsReducer([], setTodolistsAC(startState))
  expect(endState.length).toBe(2)
})

test('correct entity status of todolist should be changed', () => {
  let newStatus: RequestStatusType = requestStatus.loading
  const endState =  todolistsReducer(startState, changeTodolistEntityStatusAC(todoListId1, {status: newStatus}))
  expect(endState[0].entityStatus).toBe(newStatus)
  expect(endState[1].entityStatus).toBe(requestStatus.idle)
})

