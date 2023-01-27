import * as fromSavingCreateActions from './saving-create.actions';

export interface ISavingCreateState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
  response: any;
}

const initialCreateSavingState: ISavingCreateState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: '',
  response: null
};

export function savingCreateReducer(state = initialCreateSavingState,
                                    action: fromSavingCreateActions.SavingCreateActions) {
  switch (action.type) {
    case fromSavingCreateActions.CREATE_SAVING_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromSavingCreateActions.CREATE_SAVING_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: '',
        response: action.payload
      });
    case fromSavingCreateActions.CREATE_SAVING_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new saving data',
        response: null
      });
    case fromSavingCreateActions.CREATE_SAVING_RESET:
      return initialCreateSavingState;
    default:
      return state;
  }
}
