import * as fromPenaltyCreate from './penalty-create.actions'


export interface CreatePenaltyState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreatePenaltyState: CreatePenaltyState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function penaltyCreateReducer(state = initialCreatePenaltyState,
                                     action: fromPenaltyCreate.PenaltyCreateActions) {
  switch (action.type) {
    case fromPenaltyCreate.CREATE_PENALTY_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromPenaltyCreate.CREATE_PENALTY_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromPenaltyCreate.CREATE_PENALTY_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new penalty data'
      });
    case fromPenaltyCreate.CREATE_PENALTY_RESET:
      return initialCreatePenaltyState;
    default:
      return state;
  }
}
