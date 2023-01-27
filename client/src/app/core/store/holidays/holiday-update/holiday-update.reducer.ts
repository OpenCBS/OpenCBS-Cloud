import { ActionReducer } from '@ngrx/store';
import * as fromHolidayUpdate from './holiday-update.actions';

export interface UpdateHolidayState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateHolidayState: UpdateHolidayState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function holidayUpdateReducer(state = initialUpdateHolidayState,
                                     action: fromHolidayUpdate.HolidayUpdateActions) {
  switch (action.type) {
    case fromHolidayUpdate.UPDATE_HOLIDAY_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromHolidayUpdate.UPDATE_HOLIDAY_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromHolidayUpdate.UPDATE_HOLIDAY_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new holiday data'
      });
    case fromHolidayUpdate.UPDATE_HOLIDAY_RESET:
      return initialUpdateHolidayState;
    default:
      return state;
  }
};
