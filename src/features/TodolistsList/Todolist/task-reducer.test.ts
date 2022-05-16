import {addTaskAC, removeTaskAC, tasksReducer, TasksStateType, updateTaskAC} from '../tasks-reducer';
import {TaskPriorities, TaskStatuses, TaskType, TodolistType} from '../../../api/todolists-api';
import {addTodolistAC} from '../todolists-reducer';

let startState: TasksStateType

beforeEach(() => {
  startState = {
    'todolistId1': [
      {id: '1', todoListId: 'todolistId1', title: 'CSS', status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: '', deadline: '', description: '', order: 0, addedDate: ''},
      {id: '2', title: 'JS', todoListId: 'todolistId1', status: TaskStatuses.Completed, priority: TaskPriorities.Low, startDate: '', deadline: '', description: '', order: 0, addedDate: ''},
      {id: '3', title: 'React', todoListId: 'todolistId1', status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: '', deadline: '', description: '', order: 0, addedDate: ''}
    ],
    'todolistId2': [
      {id: '1', title: 'bread', todoListId: 'todolistId2', status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: '', deadline: '', description: '', order: 0, addedDate: ''},
      {id: '2', title: 'milk', todoListId: 'todolistId2', status: TaskStatuses.Completed, priority: TaskPriorities.Low, startDate: '', deadline: '', description: '', order: 0, addedDate: ''},
      {id: '3', title: 'tea', todoListId: 'todolistId2', status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: '', deadline: '', description: '', order: 0, addedDate: ''}
    ]
  };
})
test('correct task should be deleted from correct array', () => {
  const endState = tasksReducer(startState, removeTaskAC('2', 'todolistId2'))
  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(2)
  expect(endState['todolistId2'].every(t=> t.id !== '2')).toBeTruthy()
})

test('correct task should be added to correct array', () => {
  let newTask:TaskType = {
  id: '4', title: 'coffee', todoListId: 'todolistId2', status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: '', deadline: '', description: '', order: 0, addedDate: ''
  }
  const endState = tasksReducer(startState, addTaskAC(newTask, 'todolistId2'))
  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(4)
  expect(endState['todolistId2'][0].id).toBeDefined()
  expect(endState['todolistId2'][0].title).toBe(newTask.title)
  expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})
test ('status of specified task should be changed', () => {
let updateModel = {title: 'milk', description: '', status: TaskStatuses.New, priority: TaskPriorities.Low, startDate: '',
  deadline: ''}
  const endState = tasksReducer(startState, updateTaskAC( '2', updateModel, 'todolistId2'))
  expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
  expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
})

test ('title of specified task should be changed', () => {
  let updateModel = {title: 'butter', description: '', status: TaskStatuses.Completed, priority: TaskPriorities.Low, startDate: '', deadline: ''}
  const endState = tasksReducer(startState, updateTaskAC( '2', updateModel, 'todolistId2'))
  expect(endState['todolistId1'][1].title).toBe('JS')
  expect(endState['todolistId2'][1].title).toBe('butter')
})

test('new array should be added when new todolist is added', () => {
  let newTodolist:TodolistType = {
    id: 'todoListId3',
    title: 'New Todolist',
    addedDate: '',
    order: 0
  }
  const endState = tasksReducer(startState, addTodolistAC( newTodolist))
  const keys = Object.keys(endState);
  const newKey = keys.find(k => k !== "todolistId1" && k !== "todolistId2");
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});


