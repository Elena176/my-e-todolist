import {addTaskAC, removeTaskAC, tasksReducer, TasksStateType} from '../tasks-reducer';
import {TaskPriorities, TaskStatuses, TaskType} from '../../../api/todolists-api';

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
