import * as fromTellers from './teller-list.actions';

export interface TellerListState {
  tellers: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialTellerListState: TellerListState = {
  tellers: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function tellerListReducer(state = initialTellerListState,
                                  action: fromTellers.TellerListActions) {
  switch (action.type) {
    case fromTellers.LOAD_TELLERS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromTellers.LOAD_TELLERS_SUCCESS:
      return Object.assign({}, state, {
        tellers: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTellers.TELLERS_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromTellers.LOAD_TELLERS_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting tellers'
      });
    default:
      return state;
  }
}
