import * as fromProfileFields from './profile-fields.actions';

export interface ProfileFieldsState {
  profileFields: any[];
  loading: boolean;
  loaded: boolean;
  type: string;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialProfileFieldsState = {
  profileFields: [],
  loading: false,
  loaded: false,
  type: '',
  success: false,
  error: false,
  errorMessage: ''
};

export function profileFieldsReducer(state = initialProfileFieldsState,
                                     action: fromProfileFields.ProfileFieldsAction) {
  switch (action.type) {
    case fromProfileFields.LOADING_PROFILE_FIELDS_META:
      return Object.assign({}, state, {
        loading: true
      });
    case fromProfileFields.LOAD_PROFILE_FIELDS_META_SUCCESS:
      return Object.assign({}, state, {
        profileFields: action.payload,
        loading: false,
        loaded: true,
        type: action.payload.type,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromProfileFields.LOAD_PROFILE_FIELDS_META_FAILURE:
      return Object.assign({}, state, {
        profileFields: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting field'
      });
    case fromProfileFields.RESET_PROFILE_FIELDS_META:
      return initialProfileFieldsState;
    default:
      return state;
  }
}
