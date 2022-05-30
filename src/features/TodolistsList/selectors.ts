import {AppRootStateType} from '../../utils/types';
import {TodolistDomainType} from './types';
import {TasksStateType} from './Todolist/types';

export const selectTodoLists = (state: AppRootStateType): Array<TodolistDomainType> => state.todolists;
export const selectTasks = (state: AppRootStateType): TasksStateType => state.tasks;