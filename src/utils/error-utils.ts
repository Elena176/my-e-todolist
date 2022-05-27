import {setAppErrorAC, setAppStatusAC} from '../app/app-reducer'
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from 'redux'
import {requestStatus} from '../enum/requestStatus';
import {AxiosError} from 'axios';

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch,showError = true) => {
    if(showError) {
        dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: requestStatus.failed}))
}

export const handleServerNetworkError = (error: AxiosError, dispatch: Dispatch, showError = true) => {
    if (showError) {
        dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
        dispatch(setAppStatusAC({status: requestStatus.failed}))
    }
}

export const handleAsyncServerNetworkError = (error: AxiosError, thunkAPI: any, showError = true) => {
    if (showError) {
        thunkAPI.dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
        thunkAPI.dispatch(setAppStatusAC({status: requestStatus.failed}))
    }
    return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
}
