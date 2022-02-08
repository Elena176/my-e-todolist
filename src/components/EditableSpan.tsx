import React, {ChangeEvent, FC, useState} from 'react';

type EditableSpanPropsType = {
  value: string
  onChange: (newValue: string) => void
}
export const EditableSpan: FC<EditableSpanPropsType> = ({value, onChange}) => {
  let [editMode, setEditMode] = useState<boolean>(false);
  let [title, setTitle] = useState<string>(value)
  const activateEditMode = () => setEditMode(true)
  const activateViewMode = () => {
    setEditMode(false)
    onChange(title);
  }
  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)
  return editMode
    ? <input value={title} onChange={onChangeTitle} autoFocus onBlur={activateViewMode}/>
    : <span onDoubleClick={activateEditMode}>{title}</span>
}