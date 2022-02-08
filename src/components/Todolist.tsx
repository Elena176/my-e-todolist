import React, {ChangeEvent} from 'react';
import {FilterType, TaskType} from '../App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';


type TodolistPropsType = {
  todolistId: string
  title: string
  tasks: Array<TaskType>
  filter: FilterType
  removeTask: (id: string, todolistId: string) => void
  changeTodolistFilter: (value: FilterType, todolistId: string) => void
  addTask: (title: string, todolistId: string) => void
  changeTaskTitle: (taskId: string, title: string, todolistId: string) => void
  changeTaskStatus: (taskId: string, newIsDone: boolean, todolistId: string) => void
  removeTodolist: (todolistId: string) => void
  changeTodolistTitle: (todolistId: string, title: string) => void
}

export function Todolist(props: TodolistPropsType) {
  // добавление таски
  const onClickAddTask = (title: string) => {
    props.addTask(title, props.todolistId);
  }
  const onClickDeleteTodolist = () => {
    props.removeTodolist(props.todolistId)
  }
  const onChangeTodolistTitle = (title: string) => {
    props.changeTodolistTitle(props.todolistId, title)
  }
  const onClickSetAllFilter = () => {
    props.changeTodolistFilter('all', props.todolistId)
  }
  const onClickSetActiveFilter = () => {
    props.changeTodolistFilter('active', props.todolistId)
  }
  const onClickSetCompletedFilter = () => {
    props.changeTodolistFilter('completed', props.todolistId)
  }


  return (
    <div>
      <h3><EditableSpan value={props.title} onChange={onChangeTodolistTitle}/>
        <button onClick={onClickDeleteTodolist}> X</button>
      </h3>
      <AddItemForm addItem={onClickAddTask}/>
      <div>
        {
          props.tasks.map(t => {
              const deleteTask = () => {
                props.removeTask(t.id, props.todolistId)
              }
              const onChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
                let newTaskStatus = e.currentTarget.checked;
                props.changeTaskStatus(t.id, newTaskStatus, props.todolistId);
              }
              const onChangeTaskTitle = () => {
                props.changeTaskTitle(t.id, t.title, props.todolistId);
              }

              return <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                <input type="checkbox"
                       onChange={onChangeTaskStatus}
                       checked={t.isDone}/>
                <EditableSpan value={t.title} onChange={onChangeTaskTitle}/>
                <button onClick={deleteTask}>X</button>
              </li>
            }
          )
        }
      </div>
      <div>
        <button className={props.filter === 'all' ? 'active-filter' : ''}
                onClick={onClickSetAllFilter}>All
        </button>
        <button className={props.filter === 'active' ? 'active-filter' : ''}
                onClick={onClickSetActiveFilter}>Active
        </button>
        <button className={props.filter === 'completed' ? 'active-filter' : ''}
                onClick={onClickSetCompletedFilter}>Completed
        </button>
      </div>
    </div>
  )
}
