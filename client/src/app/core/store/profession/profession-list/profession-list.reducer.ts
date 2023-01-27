import { ActionReducer } from '@ngrx/store';
import * as fromProfessionList from './profession-list.actions';

export interface ProfessionListState {
  professions: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialProfessionListState: ProfessionListState = {
  professions: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function professionListReducer(state = initialProfessionListState,
                                      action: fromProfessionList.ProfessionListActions) {
  switch (action.type) {
    case fromProfessionList.LOADING_PROFESSIONS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromProfessionList.LOAD_PROFESSIONS_SUCCESS:
      return Object.assign({}, state, {
        professions: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromProfessionList.LOAD_PROFESSIONS_FAILURE:
      return Object.assign({}, state, {
        professions: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting profession list'
      });
    default:
      return state;
  }
};

