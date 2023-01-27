import * as fromLoanApplicationComments from './loan-application-comments.actions';

export interface ILoanApplicationComments {
  loanApplicationComments: any[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
  numberOfElements: number;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanApplicationCommentsState: ILoanApplicationComments = {
  loanApplicationComments: [],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  size: 0,
  numberOfElements: 0,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanApplicationCommentsReducer(state = initialLoanApplicationCommentsState,
                                               action: fromLoanApplicationComments.LoanApplicationCommentsActions) {
  switch (action.type) {
    case fromLoanApplicationComments.LOADING_LOAN_APPLICATION_COMMENTS:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromLoanApplicationComments.LOAD_LOAN_APPLICATION_COMMENTS_SUCCESS:
      const loan_application_comment = action.payload;
      const newComments = [...state.loanApplicationComments];
      return Object.assign({}, state, {
        loanApplicationComments: loan_application_comment.number === 0
          ? loan_application_comment.content
          : [...newComments, ...loan_application_comment.content],
        totalPages: loan_application_comment.totalPages,
        totalElements: loan_application_comment.totalElements,
        size: loan_application_comment.size,
        currentPage: loan_application_comment.number + 1,
        numberOfElements: loan_application_comment.numberOfElements,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanApplicationComments.LOAD_LOAN_APPLICATION_COMMENTS_FAILURE:
      return Object.assign({}, state, {
        loanApplicationComments: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting loan application comments'
      });
    default:
      return state;
  }
}
