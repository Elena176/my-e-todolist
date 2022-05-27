import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {AppRootStateType, useActions, useAppDispatch} from '../../app/store'
import {asyncActions, TodolistDomainType} from './todolists-reducer'
import {TasksStateType} from './tasks-reducer'
import Grid from '@mui/material/Grid';
import {AddItemForm, todolistsActions} from './index'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from 'react-router-dom';
import {selectIsLoggedIn} from '../Login/selectors';
import {AddItemFormSubmitHelperType} from '../../components/AddItemForm/AddItemForm';

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
  const dispatch = useAppDispatch();
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const isLoginIn = useSelector(selectIsLoggedIn)
  const {addTodolist, fetchTodoLists} = useActions(todolistsActions)

  const addTodolistCallBack = useCallback(async(title: string, helper: AddItemFormSubmitHelperType) => {
    const resultAction = await dispatch(
      asyncActions.addTodolist(title))
    if (asyncActions.addTodolist.rejected.match(resultAction)) {
      if (resultAction.payload?.errors?.length) {
        const errorMessage = resultAction.payload?.errors[0];
        helper.setError(errorMessage);
      } else {
        helper.setError('Some error occured')
      }
    } else {
      helper.setTitle('');
    }
    addTodolist(title)
  }, [])

  useEffect(() => {
    if (demo || !isLoginIn) {
      return;
    }
    fetchTodoLists()
  }, [demo, isLoginIn])

  if (!isLoginIn) {
    return <Navigate to="/login"/>
  }

  return <>
    <Grid container style={{padding: '20px'}}>
      <AddItemForm addItem={addTodolistCallBack}/>
    </Grid>
    <Grid container spacing={3} style={{flexWrap: 'nowrap', overflowX: 'scroll'}}>
      {
        todolists.map(tl => {
          let allTodolistTasks = tasks[tl.id]

          return <Grid item key={tl.id}>
            <div style={{width: '300px'}}>
              <Todolist
                todolist={tl}
                tasks={allTodolistTasks}
                demo={demo}
              />
            </div>
          </Grid>
        })
      }
    </Grid>
  </>
}
