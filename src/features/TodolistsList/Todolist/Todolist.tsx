import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm'
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from './Task/Task'
import {TaskStatuses, TaskType} from '../../../api/todolists-api'
import {TodolistDomainType} from '../todolists-reducer'
import {useActions, useAppDispatch} from '../../../app/store';
import {fetchTasks} from '../task-actions';
import {todolistsActions} from '../index';

type PropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  addTask: (title: string, todolistId: string) => void
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  removeTask: (params: { taskId: string, todolistId: string }) => void
  demo?: boolean
}

export const Todolist = React.memo(function ({
                                               todolist,
                                               tasks,
                                               addTask,
                                               removeTask,
                                               changeTaskTitle,
                                               changeTaskStatus,
                                               demo
                                             }: PropsType) {

  const {changeTodolistFilter, removeTodolist, changeTodolistTitle} = useActions(todolistsActions)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo) {
      return
    }
    dispatch(fetchTasks(todolist.id))
  }, [])
  const addTaskToTodolist = useCallback((title: string) => {
    addTask(title, todolist.id)
  }, [addTask, todolist.id])

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
                                        changeTaskStatus={changeTaskStatus}
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


