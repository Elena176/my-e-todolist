import {appReducer, InitialStateType, setAppErrorAC, setAppStatusAC} from './app-reducer';
import {requestStatus} from '../enum/requestStatus';

let startState: InitialStateType;

beforeEach(() => {
  startState = {
    status: requestStatus.idle,
    error: null,
    isInitialized: false
  }
})

test('correct error message should be set', () => {
  const endState = appReducer(startState, setAppErrorAC({error: 'some error'}))
  expect(endState.error).toBe('some error')
})

test('correct status should be set', () => {
  const endState = appReducer(startState, setAppStatusAC({status: requestStatus.loading}))
  expect(endState.status).toBe(requestStatus.loading)
})

/*
test('app should be initialized', () => {
  const endState = appReducer(startState, initializeApp.fulfilled({isInitialized: boolean}, {isInitialized: true}, 'requestId', ))
  expect(endState.isInitialized).toBe(true)
})*/
