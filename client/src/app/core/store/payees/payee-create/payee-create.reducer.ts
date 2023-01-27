import { ActionReducer } from '@ngrx/store';
import * as fromPayeeCreate from './payee-create.actions';


export interface CreatePayeeState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreatePayeeState: CreatePayeeState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function payeeCreateReducer(state = initialCreatePayeeState, action: fromPayeeCreate.PayeeCreateActions) {
  switch (action.type) {
    case fromPayeeCreate.CREATE_PAYEE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromPayeeCreate.CREATE_PAYEE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromPayeeCreate.CREATE_PAYEE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new payee data'
      });
    case fromPayeeCreate.CREATE_PAYEE_RESET:
      return initialCreatePayeeState;
    default:
      return state;
  }
};
