import {clearTodolistsDataAC, } from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType} from '../../api/todolists-api'
import {createSlice} from '@reduxjs/toolkit';
import {addTaskThunk, fetchTasks, removeTask, updateTask} from './task-actions';
import {addTodolistThunk, fetchTodoLists, removeTodolistThunk} from './todolists-actions';

export const slice = createSlice({
  name: 'tasks',
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addTodolistThunk.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = []
    });
    builder.addCase(removeTodolistThunk.fulfilled, (state, action) => {
      delete state[action.payload.id]
    });
    builder.addCase(fetchTodoLists.fulfilled, (state, action) => {
      action.payload.todoLists.forEach((tl: any) => state[tl.id] = [])
    });
    builder.addCase(clearTodolistsDataAC, () => {
      return {}
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const task = state[action.payload.todolistId]
      const index = task.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        task.splice(index, 1)
      }
    });
    builder.addCase(addTaskThunk.fulfilled, (state, action) => {
      state[action.payload.todoListId].unshift(action.payload)
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const task = state[action.payload.todolistId]
      const index = task.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        task[index] = {...task[index], ...action.payload.domainModel}
      }
    })
  }
})

export const tasksReducer = slice.reducer;

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}