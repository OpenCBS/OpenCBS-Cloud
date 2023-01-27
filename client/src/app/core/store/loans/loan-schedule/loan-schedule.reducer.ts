import * as fromLoanSchedule from './loan-schedule.actions';

export interface ILoanSchedule {
  loanSchedule: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanScheduleState: ILoanSchedule = {
  loanSchedule: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function loanScheduleReducer(state = initialLoanScheduleState,
                                    action: fromLoanSchedule.LoanScheduleActions) {
  switch (action.type) {
    case fromLoanSchedule.LOADING_LOAN_SCHEDULE:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanSchedule.LOAD_LOAN_SCHEDULE_SUCCESS:
      return Object.assign({}, state, {
        loanSchedule: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanSchedule.LOAD_LOAN_SCHEDULE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan schedule'
      });
    case fromLoanSchedule.RESET_LOAN_SCHEDULE:
      return initialLoanScheduleState;
    default:
      return state;
  }
}
