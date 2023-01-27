import * as fromSaving from './saving.actions';

export interface ISavingState {
  saving: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialSavingState: ISavingState = {
  saving: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function savingReducer(state = initialSavingState,
                              action: fromSaving.SavingActions) {
  switch (action.type) {
    case fromSaving.LOADING_SAVING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromSaving.LOAD_SAVING_SUCCESS:
      return Object.assign({}, state, {
        saving: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromSaving.SAVING_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromSaving.LOAD_SAVING_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan application'
      });
    case fromSaving.RESET_SAVING:
      return initialSavingState;
    default:
      return state;
  }
};
