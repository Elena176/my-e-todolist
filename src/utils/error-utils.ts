import {setAppErrorAC, setAppStatusAC} from '../app/app-reducer'
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from 'redux'
import {requestStatus} from '../enum/requestStatus';

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: requestStatus.failed}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
    dispatch(setAppErrorAC({error: error.message ?  error.message: 'Some error occurred'}))
    dispatch(setAppStatusAC({status: requestStatus.failed}))
}
