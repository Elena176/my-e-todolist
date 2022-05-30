import {setAppError, setAppStatus} from '../app'
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from 'redux'
import {requestStatus} from '../enum/requestStatus';
import {AxiosError} from 'axios';

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch,showError = true) => {
    if(showError) {
        dispatch(setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
    }
    dispatch(setAppStatus({status: requestStatus.failed}))
}

export type thunkAPItype = {
    dispatch: (action: any) => any
    rejectWithValue: Function
}
export const handleAsyncServerAppError = <D>(data: ResponseType<D>, thunkAPI: thunkAPItype, showError = true) => {
    if(showError) {
        thunkAPI.dispatch(setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
    }
    thunkAPI.dispatch(setAppStatus({status: requestStatus.failed}))
    return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldErrors})
}


export const handleServerNetworkError = (error: AxiosError, dispatch: Dispatch, showError = true) => {
    if (showError) {
        dispatch(setAppError({error: error.message ? error.message : 'Some error occurred'}))
        dispatch(setAppStatus({status: requestStatus.failed}))
    }
}

export const handleAsyncServerNetworkError = (error: AxiosError, thunkAPI: thunkAPItype, showError = true) => {
    if (showError) {
        thunkAPI.dispatch(setAppError({error: error.message ? error.message : 'Some error occurred'}))
        thunkAPI.dispatch(setAppStatus({status: requestStatus.failed}))
    }
    return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
}
