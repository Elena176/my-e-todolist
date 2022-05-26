import {setAppErrorAC, setAppStatusAC} from '../app/app-reducer'
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from 'redux'
import {requestStatus} from '../enum/requestStatus';

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch,showError = true) => {
    if(showError) {
        dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: requestStatus.failed}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch, showError = true) => {
    if (showError) {
        dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
        dispatch(setAppStatusAC({status: requestStatus.failed}))
    }
}
