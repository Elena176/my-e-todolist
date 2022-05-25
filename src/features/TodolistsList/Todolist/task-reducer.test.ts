import {addTaskThunk, fetchTasks, removeTask, tasksReducer, TasksStateType, updateTask,} from '../tasks-reducer';
import {TaskPriorities, TaskStatuses, TaskType, TodolistType} from '../../../api/todolists-api';
import {addTodolistThunk, fetchTodoLists, removeTodolistThunk} from '../todolists-reducer';

let startState: TasksStateType

beforeEach(() => {
  startState = {
    'todolistId1': [
      {
        id: '1',
        todoListId: 'todolistId1',
        title: 'CSS',
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        description: '',
        order: 0,
        addedDate: ''
      },
      {
        id: '2',
        title: 'JS',
        todoListId: 'todolistId1',
        status: TaskStatuses.Completed,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        description: '',
        order: 0,
        addedDate: ''
      },
      {
        id: '3',
        title: 'React',
        todoListId: 'todolistId1',
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        description: '',
        order: 0,
        addedDate: ''
      }
    ],
    'todolistId2': [
      {
        id: '1',
        title: 'bread',
        todoListId: 'todolistId2',
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        description: '',
        order: 0,
        addedDate: ''
      },
      {
        id: '2',
        title: 'milk',
        todoListId: 'todolistId2',
        status: TaskStatuses.Completed,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        description: '',
        order: 0,
        addedDate: ''
      },
      {
        id: '3',
        title: 'tea',
        todoListId: 'todolistId2',
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        description: '',
        order: 0,
        addedDate: ''
      }
    ]
  };
})
test('correct task should be deleted from correct array', () => {
  const endState = tasksReducer(startState, removeTask.fulfilled({taskId: '2', todolistId: 'todolistId2'}, '', {taskId: '2', todolistId: 'todolistId2'}))
  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(2)
  expect(endState['todolistId2'].every(t => t.id !== '2')).toBeTruthy()
})

test('correct task should be added to correct array', () => {
  let newTask: TaskType = {
    id: '4',
    title: 'coffee',
    todoListId: 'todolistId2',
    status: TaskStatuses.New,
    priority: TaskPriorities.Low,
    startDate: '',
    deadline: '',
    description: '',
    order: 0,
    addedDate: ''
  }
  const endState = tasksReducer(startState, addTaskThunk.fulfilled(newTask, 'requestId', {title: newTask.title, todolistId: newTask.todoListId}))
  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(4)
  expect(endState['todolistId2'][0].id).toBeDefined()
  expect(endState['todolistId2'][0].title).toBe(newTask.title)
  expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})
test('status of specified task should be changed', () => {
  let updateModel = {
    taskId: '2',
    domainModel: {status: TaskStatuses.New},
    todolistId: 'todolistId2'
  };
  const endState = tasksReducer(startState, updateTask.fulfilled(updateModel, 'requestId', updateModel))
  expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
  expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
})

test('title of specified task should be changed', () => {
  let updateModel = {
    taskId: '2',
    domainModel: {title: 'butter'},
    todolistId: 'todolistId2'
  };
  const endState = tasksReducer(startState, updateTask.fulfilled(updateModel, 'requestId', updateModel))
  expect(endState['todolistId1'][1].title).toBe('JS')
  expect(endState['todolistId2'][1].title).toBe('butter')
  expect(endState['todolistId2'][0].title).toBe('bread')
})

test('new array should be added when new todolist is added', () => {
  let newTodolist: TodolistType = {
    id: 'todoListId3',
    title: 'New Todolist',
    addedDate: '',
    order: 0
  }
  const endState = tasksReducer(startState, addTodolistThunk.fulfilled({todolist: newTodolist}, 'requestId', 'New Todolist'))
  const keys = Object.keys(endState);
  const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2');
  if (!newKey) {
    throw Error('new key should be added')
  }
  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {
  const endState = tasksReducer(startState, removeTodolistThunk.fulfilled({id: 'todolistId2'}, 'requestId', {todolistId: 'todolistId2'}))
  const keys = Object.keys(endState);
  expect(keys.length).toBe(1);
  expect(endState['todolistId2']).not.toBeDefined();
});

test('empty arrays should be added when we set todolists', () => {
  let getTodolists = {
    todoLists: [
      {id: '1', title: 'title 1', order: 0, addedDate: ''},
      {id: '2', title: 'title 2', order: 0, addedDate: ''}
    ]
  };
  const action = fetchTodoLists.fulfilled(getTodolists, 'requestId')
  const endState = tasksReducer({}, action)
  const keys = Object.keys(endState)
  expect(keys.length).toBe(2)
  expect(endState['1']).toBeDefined();
  expect(endState['2']).toBeDefined();
})

test('tasks should be added for todolist', () => {
  const action = fetchTasks.fulfilled({tasks: startState['todolistId1'], todolistId: 'todolistId1'}, '', 'todolistId1')
  // const action = setTasksAC({tasks: startState['todolistId1'], todolistId: 'todolistId1'})
  const endState = tasksReducer({
    'todolistId2': [],
    'todolistId1': []
  }, action)
  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(0)
})
