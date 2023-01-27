import * as fromRoot from './day-closure.actions';
import { DayClosure } from './day-closure.model'

export interface DayClosureState {
  dayClosure: DayClosure
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialDayClosureState: DayClosureState = {
  dayClosure: <DayClosure>{},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function dayClosureReducer(state = initialDayClosureState, action: fromRoot.DayClosureActions) {
  switch (action.type) {
    case fromRoot.LOAD_DAY_CLOSURE:
      return {
        ...state,
        loading: true
      };
    case fromRoot.POPULATE_DAY_CLOSURE:
      return {
        dayClosure: <DayClosure>action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      };
    case fromRoot.SET_DAY_CLOSURE:
      return {
        ...state,
        dayClosure: {
          ...state.dayClosure,
          ...action.payload,
          processes: {
            ...state.dayClosure.processes,
            ...action.payload.processes
          }
        }
      };
    case fromRoot.RESET_DAY_CLOSURE:
      return initialDayClosureState;
    default:
      return state;
  }
}
