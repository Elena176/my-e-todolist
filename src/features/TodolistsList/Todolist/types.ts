import {TaskPriorities, TaskStatuses} from '../../../enum/responseTask';
import {TaskType} from '../../../api/types';

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