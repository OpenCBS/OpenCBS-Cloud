import { ActionReducer } from '@ngrx/store';
import * as fromLoanAppAttach from './loan-application-attachment-delete.actions';

export interface ILoanAppAttachDelete {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialDeleteLoanApplicationAttachState: ILoanAppAttachDelete = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanAppAttachmentDelReducer(
  state = initialDeleteLoanApplicationAttachState,
  action: fromLoanAppAttach.LoanApplicationAttachmentDelActions) {
  switch (action.type) {
    case fromLoanAppAttach.DELETE_LOAN_APP_ATTACH_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanAppAttach.DELETE_LOAN_APP_ATTACH_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppAttach.DELETE_LOAN_APP_ATTACH_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error deleting file'
      });
    case fromLoanAppAttach.DELETE_LOAN_APP_ATTACH_RESET:
      return initialDeleteLoanApplicationAttachState;
    default:
      return state;
  }
};
