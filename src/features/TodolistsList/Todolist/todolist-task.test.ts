import {tasksReducer, TasksStateType} from '../tasks-reducer';
import {TodolistType} from '../../../api/todolists-api';
import {addTodolistAC, TodolistDomainType, todolistsReducer} from '../todolists-reducer';

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];
  let newTodolist:TodolistType = {
    id: 'todoListId3',
    title: 'New Todolist',
    addedDate: '',
    order: 0
  }

  const action = addTodolistAC({todolist: newTodolist});

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
