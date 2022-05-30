import {TaskPriorities, TaskStatuses} from '../enum/responseTask';

export type AuthMeType = {
  id: number
  email: string
  login: string
}

export type LoginParamsType = {
  email: string
  password: string
  rememberMe?: boolean
  captcha?: string
}

export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}

export type FieldErrorType = { error: string, field: string }

export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}

export type UpdateTaskModelType = Pick<TaskType, 'title' | 'description' | 'status' | 'priority' | 'startDate' | 'deadline'>

export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}