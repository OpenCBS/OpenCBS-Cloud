import { ActionReducer } from '@ngrx/store';
import { IProfile } from '../model/profile.model';
import * as fromProfile from './profile.actions';

const initialState: IProfile = {
  id: -1,
  name: '',
  type: '',
  status: '',
  isReadOnly: false,
  attachments: [],
  customFieldSections: [],
  currentAccounts: [],
  loading: false,
  loaded: false,
  error: false,
  success: false,
  errorMessage: ''
};

export function profileReducer(state = initialState, action: fromProfile.ProfileStateActions) {
  switch (action.type) {
    case fromProfile.LOAD_PROFILE_INFO_SUCCESS:
      const profile = action.payload;
      return Object.assign({}, state, {
        id: profile.id,
        name: profile.name,
        type: profile.type,
        status: profile.status,
        isReadOnly: profile.isReadOnly,
        attachments: profile.attachments,
        customFieldSections: profile.customFieldSections,
        currentAccounts: profile.currentAccounts,
        loading: false,
        loaded: true,
        error: false,
        success: true,
        errorMessage: ''
      });
    case fromProfile.LOADING_PROFILE_INFO:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromProfile.LOAD_PROFILE_INFO_FAILURE:
      return Object.assign({}, initialState, {
        loading: false,
        loaded: true,
        error: true,
        success: false,
        errorMessage: action.payload.message || 'Error save'
      });
    case fromProfile.RESET_PROFILE_INFO:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
