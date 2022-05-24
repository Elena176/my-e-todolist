import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {AppRootStateType, useAppDispatch} from '../../app/store'
import {
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType
} from './todolists-reducer'
import {addTaskThunk, removeTask, TasksStateType, updateTask} from './tasks-reducer'
import {TaskStatuses} from '../../api/todolists-api'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from 'react-router-dom';

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const dispatch = useAppDispatch();
  const isLoginIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)


  useEffect(() => {
    if (demo || !isLoginIn) {
      return;
    }
    const thunk = fetchTodolistsTC()
    dispatch(thunk)
  }, [dispatch, demo, isLoginIn])

  const removeTaskInTodolist = useCallback(function (taskId: string, todolistId: string) {
    const thunk = removeTask({taskId, todolistId})
    dispatch(thunk)
  }, [dispatch])

  const addTask = useCallback(function (title: string, todolistId: string) {
    const thunk = addTaskThunk({title, todolistId })
    dispatch(thunk)
  }, [dispatch])

  const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    const thunk = updateTask({taskId: id, domainModel: {status}, todolistId})
    dispatch(thunk)
  }, [dispatch])

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    const thunk = updateTask({taskId: id, domainModel: {title: newTitle}, todolistId})
    dispatch(thunk)
  }, [dispatch])

  const changeFilter = useCallback(function (todolistId: string, value: FilterValuesType) {
    const action = changeTodolistFilterAC({id: todolistId, filter: value})
    dispatch(action)
  }, [dispatch])

  const removeTodolist = useCallback(function (id: string) {
    const thunk = removeTodolistTC(id)
    dispatch(thunk)
  }, [dispatch])

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    const thunk = changeTodolistTitleTC(id, title)
    dispatch(thunk)
  }, [dispatch])

  const addTodolist = useCallback((title: string) => {
    const thunk = addTodolistTC(title)
    dispatch(thunk)
  }, [dispatch])

  if (!isLoginIn) {
    return <Navigate to="/login"/>
  }

  return <>
    <Grid container style={{padding: '20px'}}>
      <AddItemForm addItem={addTodolist}/>
    </Grid>
    <Grid container spacing={3}>
      {
        todolists.map(tl => {
          let allTodolistTasks = tasks[tl.id]

          return <Grid item key={tl.id}>
            <Paper style={{padding: '10px'}}>
              <Todolist
                todolist={tl}
                tasks={allTodolistTasks}
                removeTask={removeTaskInTodolist}
                changeFilter={changeFilter}
                addTask={addTask}
                changeTaskStatus={changeStatus}
                removeTodolist={removeTodolist}
                changeTaskTitle={changeTaskTitle}
                changeTodolistTitle={changeTodolistTitle}
                demo={demo}
              />
            </Paper>
          </Grid>
        })
      }
    </Grid>
  </>
}
