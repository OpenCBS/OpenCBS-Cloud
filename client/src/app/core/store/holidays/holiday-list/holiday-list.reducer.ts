import { ActionReducer } from '@ngrx/store';
import * as fromHolidayList from './holiday-list.actions'

export interface HolidayListState {
  holidays: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialHolidayListState: HolidayListState = {
  holidays: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function holidayListReducer(state = initialHolidayListState,
                                   action: fromHolidayList.HolidayListActions) {
  switch (action.type) {
    case fromHolidayList.LOADING_HOLIDAYS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromHolidayList.LOAD_HOLIDAYS_SUCCESS:
      return Object.assign({}, state, {
        holidays: action.payload,
        loaded: true,
        loading: false,
        error: false,
        errorMessage: ''
      });
    case fromHolidayList.LOAD_HOLIDAYS_FAILURE:
      return Object.assign({}, state, {
        holidays: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting holiday list'
      });
    default:
      return state;
  }
};


