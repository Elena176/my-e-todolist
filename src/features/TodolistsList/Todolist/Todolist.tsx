import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm'
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from './Task/Task'
import {TaskStatuses, TaskType} from '../../../api/todolists-api'
import {TodolistDomainType} from '../todolists-reducer'
import {useActions} from '../../../app/store';
import {taskActions, todolistsActions} from '../index';

type PropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  demo?: boolean
}

export const Todolist = React.memo(function ({todolist, tasks, demo}: PropsType) {
  const {changeTodolistFilter, removeTodolist, changeTodolistTitle} = useActions(todolistsActions)
  const {addTask, updateTask, removeTask, fetchTasks} = useActions(taskActions)
  const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    updateTask({taskId: id, domainModel: {status}, todolistId})
  }, [])

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    updateTask({taskId: id, domainModel: {title: newTitle}, todolistId})
  }, [])

  useEffect(() => {
    if (demo) {
      return
    }
    (fetchTasks(todolist.id))
  }, [])
  const addTaskToTodolist = useCallback((title: string) => {
    addTask({title, todolistId: todolist.id})
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

  return <div>
    <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitleIn}/>
      <IconButton onClick={removeTodolistFrom} disabled={todolist.entityStatus === 'loading'}>
        <Delete/>
      </IconButton>
    </h3>
    <AddItemForm addItem={addTaskToTodolist} disabled={todolist.entityStatus === 'loading'}/>
    <div>
      {
        tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolist.id}
                                        removeTask={removeTask}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTaskStatus={changeStatus}
        />)
      }
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
  </div>
})


