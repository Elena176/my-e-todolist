import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterType, TaskType} from '../App';


type TodolistPropsType = {
    todolistId: string
    title: string
    tasks: Array<TaskType>
    filter: FilterType
    removeTask: (id: string, todolistId: string) => void
    changeTodolistFilter: (value: FilterType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, newIsDone: boolean, todolistId: string) => void
}

export function Todolist(props: TodolistPropsType) {
    const [title, setTitle] = useState<string>('')              //храним значения введенные в input при добавлении
    const [error, setError] = useState<boolean>(false);

   const onClickAddTask = () => {                                         // добавление таски
       const validatedTitle = title.trim()
        if (validatedTitle !== '') {                                   // проверка на отрисовку ошибки при добавлении таски
            props.addTask(validatedTitle, props.todolistId);
        } else {
            setError(true);
        }
        setTitle('');
    }
    const onChangeClickHandler = (e: ChangeEvent<HTMLInputElement>) => {         // добавление таски при нажатии мышкой на +
        setTitle(e.currentTarget.value);
        setError(false);
    }

    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {                //добавление таски при нажатии Enter
        setError(false);
        if (e.key === 'Enter') {
            onClickAddTask();
        }
    }

    const onClickSetAllFilter = () => {props.changeTodolistFilter('all', props.todolistId)}
    const onClickSetActiveFilter = () => {props.changeTodolistFilter('active', props.todolistId)}
    const onClickSetCompletedFilter = () => {props.changeTodolistFilter('completed', props.todolistId)}

    const errorMessage = error && <div className='error-message'>{'Title is required'}</div>   //сообщение при добавлении
                                                                                            //пустой строки
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input value={title}
                       onChange={onChangeClickHandler}
                       onKeyPress={onKeyPress}
                       className={error ? 'error' : ''}
                />
                <button onClick={onClickAddTask}> +</button>
                {errorMessage}
            </div>
            <div>
                {
                props.tasks.map(t => {
                    const deleteTask = () => {props.removeTask(t.id, props.todolistId)}
                    const onChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
                        let newTaskStatus = e.currentTarget.checked;
                        props.changeTaskStatus(t.id, newTaskStatus, props.todolistId);
                    }

                    return  <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                            <input type="checkbox"
                                   onChange={onChangeTaskStatus}
                                   checked={t.isDone}/>
                            <span>{t.title}</span>
                            <button onClick={deleteTask}>X
                            </button>
                        </li>
                    }
                )
            }
            </div>
            <div>
                <button className={props.filter === 'all' ? 'active-filter' : ''}
                        onClick={onClickSetAllFilter}>All</button>
                <button className={props.filter === 'active' ? 'active-filter' : ''}
                        onClick={onClickSetActiveFilter}>Active</button>
                <button className={props.filter === 'completed' ? 'active-filter' : ''}
                    onClick={onClickSetCompletedFilter}>Completed</button>
            </div>
        </div>
    )
}
