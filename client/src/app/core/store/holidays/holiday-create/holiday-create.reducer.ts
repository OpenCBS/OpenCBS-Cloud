import { ActionReducer } from '@ngrx/store';
import * as fromHolidayCreate from './holiday-create.actions'


export interface CreateHolidayState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateHolidayState: CreateHolidayState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function holidayCreateReducer(state = initialCreateHolidayState,
                                     action: fromHolidayCreate.HolidayCreateActions) {
  switch (action.type) {
    case fromHolidayCreate.CREATE_HOLIDAY_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromHolidayCreate.CREATE_HOLIDAY_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromHolidayCreate.CREATE_HOLIDAY_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new holiday data'
      });
    case fromHolidayCreate.CREATE_HOLIDAY_RESET:
      return initialCreateHolidayState;
    default:
      return state;
  }
};
