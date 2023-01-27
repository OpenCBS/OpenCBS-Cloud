import * as fromSavingProfile from './saving-profile-list.actions';

export interface ISavingProfileList {
  savingProfile: any[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
  numberOfElements: number;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialSavingProfileState: ISavingProfileList = {
  savingProfile: [],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  size: 0,
  numberOfElements: 0,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function savingProfileListReducer(state = initialSavingProfileState,
                                         action: fromSavingProfile.SavingProfileListActions) {
  switch (action.type) {
    case fromSavingProfile.LOADING_SAVINGS_PROFILE:
      return Object.assign({}, state, {
        loading: true
      });
    case fromSavingProfile.LOAD_SAVINGS_PROFILE_SUCCESS:
      const saving = action.payload;
      return Object.assign({}, state, {
        savingProfile: saving.content,
        totalPages: saving.totalPages,
        totalElements: saving.totalElements,
        size: saving.size,
        currentPage: saving.number,
        numberOfElements: saving.numberOfElements,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromSavingProfile.LOAD_SAVINGS_PROFILE_FAILURE:
      return Object.assign({}, state, {
        savingProfile: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting saving profile list'
      });
    default:
      return state;
  }
}
