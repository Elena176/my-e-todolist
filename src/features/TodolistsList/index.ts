import {asyncTaskActions as taskAsyncActions} from './tasks-reducer';
import {asyncActions as todolistsAsyncActions} from './todolists-reducer';
import {slice} from './todolists-reducer';
import {TodolistsList} from './TodolistsList';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm';


const taskActions = {
  ...taskAsyncActions
}
const todolistsActions = {
  ...todolistsAsyncActions,
  ...slice.actions
}

export {
  taskActions,
  todolistsActions,
  TodolistsList,
  AddItemForm
}
