import React, {useCallback, useEffect} from 'react'
import {AddItemForm, AddItemFormSubmitHelperType} from '../../../components/AddItemForm/AddItemForm'
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from './Task/Task'
import {TaskType} from '../../../api/types'
import {useActions, useAppDispatch} from '../../../utils/redux-utils';
import {taskActions, todolistsActions} from '../index';
import {requestStatus} from '../../../enum/requestStatus';
import {Paper} from '@mui/material';
import {TaskStatuses} from '../../../enum/responseTask';
import {TodolistDomainType} from '../types';

type PropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  demo?: boolean
}

export const Todolist = React.memo(function ({todolist, tasks, demo}: PropsType) {
  const dispatch = useAppDispatch()
  const {changeTodolistFilter, removeTodolist, changeTodolistTitle} = useActions(todolistsActions)
  const {fetchTasks} = useActions(taskActions)

  useEffect(() => {
    if (demo) {
      return
    }
    (fetchTasks(todolist.id))
  }, [])
  const addTaskToTodolist = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
    const resultAction = await dispatch(
      taskActions.addTask({title, todolistId: todolist.id}))
    if (taskActions.addTask.rejected.match(resultAction)) {
      if (resultAction.payload?.errors?.length) {
        const errorMessage = resultAction.payload?.errors[0];
        helper.setError(errorMessage);
      } else {
        helper.setError('Some error occured')
      }
    } else {
      helper.setTitle('');
    }
  }, [todolist.id])

  const removeTodolistFrom = () => {
    removeTodolist({todolistId: todolist.id})
  }
  const changeTodolistTitleIn = useCallback((title: string) => {
    changeTodolistTitle({id: todolist.id, title})
  }, [todolist.id])

  const onAllClickHandler = useCallback(() => changeTodolistFilter({
    filter: 'all',
    id: todolist.id
  }), [todolist.id])
  const onActiveClickHandler = useCallback(() => changeTodolistFilter({
    filter: 'active',
    id: todolist.id
  }), [todolist.id])
  const onCompletedClickHandler = useCallback(() => changeTodolistFilter({
    filter: 'completed',
    id: todolist.id
  }), [todolist.id])

  let tasksForTodolist = tasks

  if (todolist.filter === 'active') {
    tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
  }
  if (todolist.filter === 'completed') {
    tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
  }

  return <Paper style={{padding: '10px', position: 'relative'}}>
    <IconButton onClick={removeTodolistFrom} disabled={todolist.entityStatus === requestStatus.loading}
                style={{position: 'absolute', right: '5px', top: '2px'}}>
      <Delete/>
    </IconButton>
    <h3>
      <EditableSpan value={todolist.title} onChange={changeTodolistTitleIn}/>
    </h3>
    <AddItemForm addItem={addTaskToTodolist} disabled={todolist.entityStatus === requestStatus.loading}/>
    <div>
      {
        tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolist.id}
        />)
      }
      {!tasksForTodolist.length && <span style={{color: 'grey', padding: '10px'}}>No tasks</span>}
    </div>
    <div style={{paddingTop: '10px'}}>
      <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
              onClick={onAllClickHandler}
              color={'inherit'}
      >All
      </Button>
      <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
              onClick={onActiveClickHandler}
              color={'primary'}>Active
      </Button>
      <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
              onClick={onCompletedClickHandler}
              color={'secondary'}>Completed
      </Button>
    </div>
  </Paper>
})


