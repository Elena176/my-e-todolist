import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {AppRootStateType, useActions} from '../../app/store'
import {TodolistDomainType} from './todolists-reducer'
import {TasksStateType} from './tasks-reducer'
import {TaskStatuses} from '../../api/todolists-api'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from 'react-router-dom';
import {selectIsLoggedIn} from '../Login/selectors';
import {taskActions, todolistsActions} from './index';

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const isLoginIn = useSelector(selectIsLoggedIn)
  const {removeTask, updateTask, addTask} = useActions(taskActions)
  const { addTodolist, changeTodolistTitle, fetchTodoLists} = useActions(todolistsActions)

  useEffect(() => {
    if (demo || !isLoginIn) {
      return;
    }
     fetchTodoLists()
  }, [demo, isLoginIn])

  const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    updateTask({taskId: id, domainModel: {status}, todolistId})
  }, [])

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    updateTask({taskId: id, domainModel: {title: newTitle}, todolistId})
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
                removeTask={removeTask}
                addTask={addTask}
                changeTaskStatus={changeStatus}
                changeTaskTitle={changeTaskTitle}
                demo={demo}
              />
            </Paper>
          </Grid>
        })
      }
    </Grid>
  </>
}
