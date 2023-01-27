import { ActionReducer } from '@ngrx/store';
import * as fromPayeeList from './payee-list.actions';

export interface PayeeListState {
  payees: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
  numberOfElements: number;
}

const initialPayeeListState: PayeeListState = {
  payees: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: '',
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  size: 0,
  numberOfElements: 0
};

export function payeeListReducer(state = initialPayeeListState,
                                 action: fromPayeeList.PayeeListActions) {
  switch (action.type) {
    case fromPayeeList.LOADING_PAYEES:
      return Object.assign({}, state, {
        loading: true
      });
    case fromPayeeList.LOAD_PAYEES_SUCCESS:
      const payees = action.payload;
      return Object.assign({}, state, {
        payees: payees.content,
        totalPages: payees.totalPages,
        totalElements: payees.totalElements,
        size: payees.size,
        currentPage: payees.number,
        numberOfElements: payees.numberOfElements,
        loaded: true,
        loading: false
      });
    case fromPayeeList.LOAD_PAYEES_FAILURE:
      return Object.assign({}, state, {
        payees: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting payee list'
      });
    default:
      return state;
  }
};
