import { ActionReducer } from '@ngrx/store';
import * as fromProfessionCreate from './profession-create.actions';

export interface CreateProfessionState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateProfessionState: CreateProfessionState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function professionCreateReducer(state = initialCreateProfessionState, action: fromProfessionCreate.ProfessionCreateActions) {
  switch (action.type) {
    case fromProfessionCreate.CREATE_PROFESSION_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromProfessionCreate.CREATE_PROFESSION_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromProfessionCreate.CREATE_PROFESSION_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new profession data'
      });
    case fromProfessionCreate.CREATE_PROFESSION_RESET:
      return initialCreateProfessionState;
    default:
      return state;
  }
};
