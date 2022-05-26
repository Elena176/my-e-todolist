import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {AppRootStateType, useActions, useAppDispatch} from '../../app/store'
import {
  changeTodolistFilterAC, FilterValuesType, TodolistDomainType
} from './todolists-reducer'
import {TasksStateType} from './tasks-reducer'
import {TaskStatuses} from '../../api/todolists-api'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from 'react-router-dom';
import {selectIsLoggedIn} from '../Login/selectors';
import {bindActionCreators} from 'redux';
import {taskActions, todolistsActions} from './index';

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const dispatch = useAppDispatch();
  const isLoginIn = useSelector(selectIsLoggedIn)
  const {removeTask, updateTask, addTaskThunk} = useActions(taskActions)
  const {removeTodolistThunk, addTodolistThunk, changeTodolistTitleThunk, fetchTodoLists} = useActions(todolistsActions)


  useEffect(() => {
    if (demo || !isLoginIn) {
      return;
    }
     fetchTodoLists()
  }, [dispatch, demo, isLoginIn])

  const removeTaskInTodolist = useCallback(function (taskId: string, todolistId: string) {
    removeTask({taskId, todolistId})
  }, [])

  const addTask = useCallback(function (title: string, todolistId: string) {
    addTaskThunk({title, todolistId })
  }, [])

  const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    updateTask({taskId: id, domainModel: {status}, todolistId})
  }, [])

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    updateTask({taskId: id, domainModel: {title: newTitle}, todolistId})
  }, [])

  const changeFilter = useCallback(function (todolistId: string, value: FilterValuesType) {
    dispatch(changeTodolistFilterAC({id: todolistId, filter: value}))
  }, [dispatch])

  const removeTodolist = useCallback(function (id: string) {
  removeTodolistThunk({todolistId: id})
  }, [])

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    changeTodolistTitleThunk({id, title})
  }, [])

  const addTodolist = useCallback((title: string) => {
    addTodolistThunk(title)
  }, [])

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
