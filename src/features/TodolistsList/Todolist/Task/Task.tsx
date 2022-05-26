import React, {ChangeEvent, useCallback} from 'react'
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan'
import {Delete} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from '../../../../api/todolists-api'
import {useActions} from '../../../../app/store';
import {taskActions} from '../../index';

type TaskPropsType = {
  task: TaskType
  todolistId: string
}
export const Task = React.memo(({task, todolistId}: TaskPropsType) => {

  const {updateTask, removeTask} = useActions(taskActions)

  const onClickHandler = useCallback(() => removeTask({
    taskId: task.id,
    todolistId
  }), [task.id, todolistId, removeTask]);

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    updateTask({
      taskId: task.id,
      domainModel: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New},
      todolistId
    })
  }, [task.id, todolistId]);

  const onTitleChangeHandler = useCallback((newValue: string) => {
    updateTask({taskId: task.id, domainModel:{title: newValue}, todolistId})
  }, [task.id, todolistId]);

  return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
    <Checkbox
      checked={task.status === TaskStatuses.Completed}
      color="primary"
      onChange={onChangeHandler}
    />

    <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
    <IconButton onClick={onClickHandler}>
      <Delete/>
    </IconButton>
  </div>
})
