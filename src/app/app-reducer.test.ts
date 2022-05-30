import {setAppError, setAppStatus, slice} from './app-reducer';
import {requestStatus} from '../enum/requestStatus';
import {InitialStateType} from './types';
const {reducer: appReducer} = slice;
let startState: InitialStateType;

beforeEach(() => {
  startState = {
    status: requestStatus.idle,
    error: null,
    isInitialized: false
  }
})

test('correct error message should be set', () => {
  const endState = appReducer(startState, setAppError({error: 'some error'}))
  expect(endState.error).toBe('some error')
})

test('correct status should be set', () => {
  const endState = appReducer(startState, setAppStatus({status: requestStatus.loading}))
  expect(endState.status).toBe(requestStatus.loading)
})

/*
test('app should be initialized', () => {
  const endState = appReducer(startState, initializeApp.fulfilled({isInitialized: boolean}, {isInitialized: true}, 'requestId', ))
  expect(endState.isInitialized).toBe(true)
})*/
