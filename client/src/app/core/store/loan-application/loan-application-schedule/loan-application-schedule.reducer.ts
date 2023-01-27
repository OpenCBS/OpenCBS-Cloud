import * as fromLoanAppSchedule from './loan-application-schedule.actions';

export interface ILoanAppSchedule {
  loanAppSchedule: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanAppScheduleState: ILoanAppSchedule = {
  loanAppSchedule: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function loanAppScheduleReducer(state = initialLoanAppScheduleState,
                                       action: fromLoanAppSchedule.LoanAppScheduleActions) {
  switch (action.type) {
    case fromLoanAppSchedule.LOADING_LOAN_APP_SCHEDULE:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanAppSchedule.LOAD_LOAN_APP_SCHEDULE_SUCCESS:
      return Object.assign({}, state, {
        loanAppSchedule: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppSchedule.LOAD_LOAN_APP_SCHEDULE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan application schedule'
      });
    case fromLoanAppSchedule.RESET_LOAN_APP_SCHEDULE:
      return initialLoanAppScheduleState;
    default:
      return state;
  }
}
