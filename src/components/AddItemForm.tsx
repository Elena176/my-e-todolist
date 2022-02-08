import React, {ChangeEvent, FC, KeyboardEvent, useState} from 'react';

type AddItemPropsType = {
  addItem: (title: string) => void
}
export const AddItemForm:FC<AddItemPropsType> = ({addItem}) => {
  //храним значения введенные в input при добавлении
  const [title, setTitle] = useState<string>('')
  const [error, setError] = useState<string | null>(null);
  // добавление таски при нажатии мышкой на +
  const onChangeClickHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  }
  //добавление таски при нажатии Enter
  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (e.key === 'Enter') {
      onClickAddItem();
    }
  }
  // добавление item
  const onClickAddItem = () => {
    const validatedTitle = title.trim()
    // проверка на отрисовку ошибки при добавлении таски
    if (validatedTitle !== '') {
      addItem(validatedTitle);
    } else {
      setError('Title is required');
    }
    setTitle('');
  }
  //сообщение при добавлении пустой строки
  const errorMessage = error && <div className="error-message">{error}</div>
  return (
    <div>
      <div>
        <input value={title}
               onChange={onChangeClickHandler}
               onKeyPress={onKeyPress}
               className={error ? 'error' : ''}
        />
        <button onClick={onClickAddItem}> + </button>
        {errorMessage}
      </div>
    </div>
  )
}