import React, {useState} from 'react';
import './App.css';
import {Todolist} from './components/Todolist';
import {v1} from 'uuid';
import {AddItemForm} from './components/AddItemForm';

export type FilterType = 'all' | 'active' | 'completed'
export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

export type TodolistType = {
  id: string
  title: string
  filter: FilterType
}

export type TasksStateType = {
  [key: string]: Array<TaskType>
}

function App() {

  const todolistId1 = v1();
  const todolistId2 = v1();

  const [todolists, setTodolists] = useState<Array<TodolistType>>([
    {id: todolistId1, title: 'What to buy', filter: 'all'},
    {id: todolistId2, title: 'What to learn', filter: 'all'}
  ])

  const [tasks, setTasks] = useState<TasksStateType>({
    [todolistId1]: [
      {id: v1(), title: 'Milk', isDone: true},
      {id: v1(), title: 'Chocolate', isDone: true},
      {id: v1(), title: 'Butter', isDone: false},
    ],
    [todolistId2]: [
      {id: v1(), title: 'HTML', isDone: true},
      {id: v1(), title: 'CSS', isDone: true},
      {id: v1(), title: 'React', isDone: false},
      {id: v1(), title: 'Redux', isDone: false}
    ]
  })

  //отрисовываем отфильтрованные таски в тудулистах
  function changeTodolistFilter(value: FilterType, todolistId: string) {
    setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, filter: value} : tl));
  }

  function changeTodolistTitle(todolistId: string, title: string) {
    setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, title} : tl));
  }

  // удаление таски в тудулисте
  function removeTask(id: string, todolistId: string) {
    tasks[todolistId] = tasks[todolistId].filter(t => t.id !== id)
    setTasks({...tasks});
  }

  //добавление таски
  function addTask(title: string, todolistId: string) {
    let task = {                                        //создаем обьект - новую таску
      id: v1(),
      title: title,
      isDone: false
    }

    tasks[todolistId] = [task, ...tasks[todolistId]];
    setTasks({...tasks});
  }

  function changeTaskStatus(taskId: string, newIsDone: boolean, todolistId: string) {
    const copyTasks = {...tasks}
    copyTasks[todolistId] = tasks[todolistId].map(t => t.id === taskId ? {...t, isDone: newIsDone} : t)
    setTasks(copyTasks);
  }

  function changeTaskTitle(taskId: string, title: string, todolistId: string) {
    const copyTasks = {...tasks}
    copyTasks[todolistId] = tasks[todolistId].map(t => t.id === taskId ? {...t, title} : t)
    setTasks(copyTasks);
  }

  function removeTodolist(todolistId: string) {
    setTodolists(todolists.filter(tl => tl.id !== todolistId))
    const copyTasks = {...tasks}
    delete copyTasks[todolistId]
    setTasks(copyTasks)
  }

  const addTodolist = (title: string) => {
    let newTodolistId = v1();
    let newTodolist: TodolistType = {id: newTodolistId, title: title, filter: 'all'}
    setTodolists([newTodolist, ...todolists]);
    setTasks({
      ...tasks,
      [newTodolistId]: []
    })
  }

  //фильтрование тасок
  function getFilteredTask(tl: TodolistType) {
    switch (tl.filter) {
      case('active'):
        return tasks[tl.id].filter(t => !t.isDone);
      case('completed'):
        return tasks[tl.id].filter(t => t.isDone);
      default:
        return tasks[tl.id];
    }
  }

  return (
    <div className="App">
      <AddItemForm addItem={addTodolist}/>
      {
        todolists.map(tl => {
          let tasksForTodolist = getFilteredTask(tl);
          return <Todolist
            key={tl.id}
            title={tl.title}
            tasks={tasksForTodolist}
            filter={tl.filter}
            todolistId={tl.id}
            removeTask={removeTask}
            changeTodolistFilter={changeTodolistFilter}
            addTask={addTask}
            changeTaskTitle={changeTaskTitle}
            changeTaskStatus={changeTaskStatus}
            removeTodolist={removeTodolist}
            changeTodolistTitle={changeTodolistTitle}
          />
        })
      }
    </div>
  );
}

export default App;
