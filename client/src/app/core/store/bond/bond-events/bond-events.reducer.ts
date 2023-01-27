import * as fromBondEventsActions from './bond-events.actions';

export interface BondEventsState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
  bondEvents: any;
}

const initialBondState: BondEventsState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: '',
  bondEvents: null
};

export function bondEventsReducer(state = initialBondState,
                                  action: fromBondEventsActions.BondEventsActions) {
  switch (action.type) {
    case fromBondEventsActions.BOND_EVENTS_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromBondEventsActions.BOND_EVENTS_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: '',
        bondEvents: action.payload
      });
    case fromBondEventsActions.BOND_EVENTS_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting bond events',
        bondEvents: null
      });
    case fromBondEventsActions.BOND_EVENTS_RESET:
      return initialBondState;
    default:
      return state;
  }
}
