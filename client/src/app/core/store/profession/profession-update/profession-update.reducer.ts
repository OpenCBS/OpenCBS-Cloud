import { ActionReducer } from '@ngrx/store';
import * as fromProfessionUpdate from './profession-update.actions';

export interface UpdateProfessionState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateProfessionState: UpdateProfessionState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function professionUpdateReducer(
  state = initialUpdateProfessionState,
  action: fromProfessionUpdate.ProfessionUpdateActions
) {
  switch (action.type) {
    case fromProfessionUpdate.UPDATE_PROFESSION_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromProfessionUpdate.UPDATE_PROFESSION_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromProfessionUpdate.UPDATE_PROFESSION_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new profession data'
      });
    case fromProfessionUpdate.UPDATE_PROFESSION_RESET:
      return initialUpdateProfessionState;
    default:
      return state;
  }
};
