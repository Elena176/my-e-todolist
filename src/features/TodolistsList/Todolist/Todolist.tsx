import React, {useCallback} from 'react'
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm'
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from './Task/Task'
import {TaskStatuses, TaskType} from '../../../api/todolists-api'
import {FilterValuesType, TodolistDomainType} from '../todolists-reducer'

type PropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  changeFilter: (todolistId: string, value: FilterValuesType) => void
  addTask: (title: string, todolistId: string) => void
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  removeTask: (taskId: string, todolistId: string) => void
  removeTodolist: (id: string) => void
  changeTodolistTitle: (id: string, newTitle: string) => void
  demo?: boolean
}

export const Todolist = React.memo(function ({
                                               todolist,
                                               tasks,
                                               addTask,
                                               removeTodolist,
                                               changeTodolistTitle,
                                               changeFilter,
                                               removeTask,
                                               changeTaskTitle,
                                               changeTaskStatus
                                             }: PropsType) {

  const addTaskToTodolist = useCallback((title: string) => {
    addTask(title, todolist.id)
  }, [addTask, todolist.id])

  const removeTodolistFrom = () => {
    removeTodolist(todolist.id)
  }
  const changeTodolistTitleIn = useCallback((title: string) => {
    changeTodolistTitle(todolist.id, title)
  }, [todolist.id, changeTodolistTitle])

  const onAllClickHandler = useCallback(() => changeFilter(todolist.id, 'all'), [todolist.id, changeFilter])
  const onActiveClickHandler = useCallback(() => changeFilter(todolist.id, 'active'), [todolist.id, changeFilter])
  const onCompletedClickHandler = useCallback(() => changeFilter(todolist.id, 'completed'), [todolist.id, changeFilter])


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


