import { ActionReducer } from '@ngrx/store';
import * as fromBorrowingSchedule from './borrowing-schedule.actions';


export interface IBorrowingSchedule {
  borrowingSchedule: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialBorrowingScheduleState: IBorrowingSchedule = {
  borrowingSchedule: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function borrowingScheduleReducer(state = initialBorrowingScheduleState,
                                         action: fromBorrowingSchedule.BorrowingScheduleActions) {
  switch (action.type) {
    case fromBorrowingSchedule.LOADING_BORROWING_SCHEDULE:
      return Object.assign({}, state, {
        loading: true
      });
    case fromBorrowingSchedule.LOAD_BORROWING_SCHEDULE_SUCCESS:
      return Object.assign({}, state, {
        borrowingSchedule: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromBorrowingSchedule.LOAD_BORROWING_SCHEDULE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan application schedule'
      });
    case fromBorrowingSchedule.RESET_BORROWING_SCHEDULE:
      return initialBorrowingScheduleState;
    default:
      return state;
  }
};
