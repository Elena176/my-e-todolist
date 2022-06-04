export type AddItemFormSubmitHelperType = {
  setError: (error: string) => void,
  setTitle: (title: string) => void
}

export type AddItemFormPropsType = {
  addItem: (title: string, helper: { setError: (error: string) => void, setTitle: (title: string) => void }) => void
  disabled?: boolean
}