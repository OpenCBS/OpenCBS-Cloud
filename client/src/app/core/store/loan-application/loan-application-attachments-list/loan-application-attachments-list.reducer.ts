import { ActionReducer } from '@ngrx/store';
import * as fromLoanAppAttachList from './loan-application-attachments-list.actions';


export interface ILoanAppAttachList {
  loanAppAttachments: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanAppAttachmentListState: ILoanAppAttachList = {
  loanAppAttachments: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function loanAppAttachmentListReducer(
  state = initialLoanAppAttachmentListState,
  action: fromLoanAppAttachList.LoanAppAttachmentListActions) {
  switch (action.type) {
    case fromLoanAppAttachList.LOADING_LOAN_APP_ATTACHMENTS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanAppAttachList.LOAD_LOAN_APP_ATTACHMENTS_SUCCESS:
      return Object.assign({}, state, {
        loanAppAttachments: action.payload.data,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppAttachList.LOAD_LOAN_APP_ATTACHMENTS_FAILURE:
      return Object.assign({}, state, {
        loanAppAttachments: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan application attachments list'
      });
    case fromLoanAppAttachList.RESET_LOAN_APP_ATTACHMENTS:
      return initialLoanAppAttachmentListState;
    default:
      return state;
  }
};

