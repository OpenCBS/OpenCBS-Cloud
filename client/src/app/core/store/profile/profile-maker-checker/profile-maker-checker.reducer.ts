import { IProfile } from '../model/profile.model';
import * as fromProfileMakerChecker from './profile-maker-checker.actions';

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

export function profileMakerCheckerReducer(state = initialState,
                                                   action: fromProfileMakerChecker.ProfileMakerCheckerActions) {
  switch (action.type) {
    case fromProfileMakerChecker.LOAD_PROFILE_MAKER_CHECKER_SUCCESS:
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
    case fromProfileMakerChecker.LOADING_PROFILE_MAKER_CHECKER:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromProfileMakerChecker.LOAD_PROFILE_MAKER_CHECKER_FAILURE:
      return Object.assign({}, initialState, {
        loading: false,
        loaded: true,
        error: true,
        success: false,
        errorMessage: action.payload.message || 'Error save'
      });
    case fromProfileMakerChecker.RESET_PROFILE_MAKER_CHECKER:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
