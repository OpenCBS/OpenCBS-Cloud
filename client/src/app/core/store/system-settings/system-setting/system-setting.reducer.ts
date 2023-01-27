import * as fromSystemSetting from './system-setting.actions';

export interface ISystemSettingState {
  systemSetting: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialSystemSettingState: ISystemSettingState = {
  systemSetting: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function systemSettingReducer(state = initialSystemSettingState,
                                     action: fromSystemSetting.SystemSettingActions) {
  switch (action.type) {
    case fromSystemSetting.LOADING_SYSTEM_SETTING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromSystemSetting.LOAD_SYSTEM_SETTING_SUCCESS:
      return Object.assign({}, state, {
        systemSetting: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromSystemSetting.SYSTEM_SETTING_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromSystemSetting.LOAD_SYSTEM_SETTING_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting System setting'
      });
    case fromSystemSetting.RESET_SYSTEM_SETTING:
      return initialSystemSettingState;
    default:
      return state;
  }
}
