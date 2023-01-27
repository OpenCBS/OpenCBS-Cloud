import * as fromProfileAttachDel from './profile-attach-delete.actions';

export interface DeleteProfileAttachState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialDeleteProfileAttachState: DeleteProfileAttachState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function profileAttachmentDelReducer(
  state = initialDeleteProfileAttachState,
  action: fromProfileAttachDel.ProfileAttachmentDelActions) {
  switch (action.type) {
    case fromProfileAttachDel.DELETE_PROFILE_ATTACH_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromProfileAttachDel.DELETE_PROFILE_ATTACH_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromProfileAttachDel.DELETE_PROFILE_ATTACH_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error deleting file'
      });
    case fromProfileAttachDel.DELETE_PROFILE_ATTACH_RESET:
      return initialDeleteProfileAttachState;
    default:
      return state;
  }
}
