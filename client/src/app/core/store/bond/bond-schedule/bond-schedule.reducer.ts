import { ActionReducer } from '@ngrx/store';
import * as fromBondSchedule from './bond-schedule.actions';


export interface IBondSchedule {
  bondSchedule: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialBondScheduleState: IBondSchedule = {
  bondSchedule: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function bondScheduleReducer(state = initialBondScheduleState,
                                    action: fromBondSchedule.BondScheduleActions) {
  switch (action.type) {
    case fromBondSchedule.LOADING_BOND_SCHEDULE:
      return Object.assign({}, state, {
        loading: true
      });
    case fromBondSchedule.LOAD_BOND_SCHEDULE_SUCCESS:
      return Object.assign({}, state, {
        bondSchedule: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromBondSchedule.LOAD_BOND_SCHEDULE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting bond schedule'
      });
    case fromBondSchedule.RESET_BOND_SCHEDULE:
      return initialBondScheduleState;
    default:
      return state;
  }
};
