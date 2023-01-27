import * as fromSavingUpdate from './saving-update.actions';

export interface ISavingUpdateState {
  response: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateSavingState: ISavingUpdateState = {
  response: null,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function savingUpdateReducer(state = initialUpdateSavingState,
                                    action: fromSavingUpdate.SavingUpdateActions) {
  switch (action.type) {
    case fromSavingUpdate.UPDATE_SAVING_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromSavingUpdate.UPDATE_SAVING_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromSavingUpdate.UPDATE_SAVING_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new Saving'
      });
    case fromSavingUpdate.UPDATE_SAVING_RESET:
      return initialUpdateSavingState;
    default:
      return state;
  }
};
