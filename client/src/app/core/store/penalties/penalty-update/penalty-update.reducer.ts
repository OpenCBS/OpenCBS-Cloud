import * as fromPenaltyUpdate from './penalty-update.actions';

export interface UpdatePenaltyState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdatePenaltyState: UpdatePenaltyState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function penaltyUpdateReducer(state = initialUpdatePenaltyState,
                                     action: fromPenaltyUpdate.PenaltyUpdateActions) {
  switch (action.type) {
    case fromPenaltyUpdate.UPDATE_PENALTY_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromPenaltyUpdate.UPDATE_PENALTY_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromPenaltyUpdate.UPDATE_PENALTY_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new penalty data'
      });
    case fromPenaltyUpdate.UPDATE_PENALTY_RESET:
      return initialUpdatePenaltyState;
    default:
      return state;
  }
};
