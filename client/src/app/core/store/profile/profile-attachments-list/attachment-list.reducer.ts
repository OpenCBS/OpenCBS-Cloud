import * as fromAttachList from './attachment-list.actions';

export interface ProfileAttachmentListState {
  profileAttachments: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialProfileAttachmentListState: ProfileAttachmentListState = {
  profileAttachments: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function profileAttachmentListReducer(
  state = initialProfileAttachmentListState,
  action: fromAttachList.ProfileAttachmentListActions) {
  switch (action.type) {
    case fromAttachList.LOAD_PROFILE_ATTACHMENTS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromAttachList.LOAD_PROFILE_ATTACHMENTS_SUCCESS:
      return Object.assign({}, state, {
        profileAttachments: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromAttachList.LOAD_PROFILE_ATTACHMENTS_FAILURE:
      return Object.assign({}, state, {
        profileAttachments: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting profile attachments list'
      });
    case fromAttachList.RESET_PROFILE_ATTACHMENTS:
      return initialProfileAttachmentListState;
    default:
      return state;
  }
}

