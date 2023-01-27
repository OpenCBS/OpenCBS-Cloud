import * as fromSystemSettingUpdate from './system-setting-update.actions';

export interface UpdateSystemSettingState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateSystemSettingState: UpdateSystemSettingState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function updateSystemSettingReducer(state = initialUpdateSystemSettingState,
                                     action: fromSystemSettingUpdate.SystemSettingUpdateActions) {
  switch (action.type) {
    case fromSystemSettingUpdate.UPDATE_SYSTEM_SETTING_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromSystemSettingUpdate.UPDATE_SYSTEM_SETTING_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromSystemSettingUpdate.UPDATE_SYSTEM_SETTING_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving system setting data'
      });
    case fromSystemSettingUpdate.UPDATE_SYSTEM_SETTING_RESET:
      return initialUpdateSystemSettingState;
    default:
      return state;
  }
}
