import { ActionReducer } from '@ngrx/store';
import * as fromLoanAttachList from './loan-attachment-list.actions';

export interface ILoanAttachmentList {
  attachments: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanAttachmentListState: ILoanAttachmentList = {
  attachments: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function loanAttachmentListReducer(state = initialLoanAttachmentListState,
                                          action: fromLoanAttachList.LoanAttachmentListActions) {
  switch (action.type) {
    case fromLoanAttachList.LOADING_LOAN_ATTACHMENT_LIST:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanAttachList.LOAD_LOAN_ATTACHMENT_LIST_SUCCESS:
      return Object.assign({}, state, {
        attachments: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAttachList.LOAD_LOAN_ATTACHMENT_LIST_FAILURE:
      return Object.assign({}, state, {
        attachments: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loans'
      });
    default:
      return state;
  }
}
