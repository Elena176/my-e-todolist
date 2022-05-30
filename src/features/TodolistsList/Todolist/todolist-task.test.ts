import {TodolistType} from '../../../api/types';
import {TasksStateType} from './types';
import {TodolistDomainType} from '../types';
import {slice as tasksSlice} from '../tasks-reducer';
import {asyncActions, slice} from '../todolists-reducer';

const todolistsReducer = slice.reducer
const tasksReducer = tasksSlice.reducer
const {addTodolist} = asyncActions

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];
  let newTodolist:TodolistType = {
    id: 'todoListId3',
    title: 'New Todolist',
    addedDate: '',
    order: 0
  }

  const action = addTodolist.fulfilled({todolist: newTodolist}, 'requestId', 'New Todolist');

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
