import { ActionReducer } from '@ngrx/store';
import * as fromLoanAttachDelete from './loan-attachment-delete.actions';

export interface ILoanAttachDelete {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialDeleteLoanAttachState: ILoanAttachDelete = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanAttachmentDelReducer(state = initialDeleteLoanAttachState,
                                         action: fromLoanAttachDelete.LoanAttachmentDelActions) {
  switch (action.type) {
    case fromLoanAttachDelete.DELETE_LOAN_ATTACH_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanAttachDelete.DELETE_LOAN_ATTACH_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAttachDelete.DELETE_LOAN_ATTACH_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error deleting file'
      });
    case fromLoanAttachDelete.DELETE_LOAN_ATTACH_RESET:
      return initialDeleteLoanAttachState;
    default:
      return state;
  }
}
