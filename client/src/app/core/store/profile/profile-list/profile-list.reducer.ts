import { ActionReducer } from '@ngrx/store';
import { IProfileList } from '../model/profile.model';
import * as fromProfileList from './profiles-list.actions';

const initialState: IProfileList = {
  profiles: [],
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

export function profilesReducer(state = initialState,
                                action: fromProfileList.ProfilesListActions) {
  switch (action.type) {
    case fromProfileList.LOADING_PROFILES:
      return Object.assign({}, state, {
        loading: true
      });
    case fromProfileList.LOAD_PROFILES_SUCCESS:
      const profiles = action.payload;
      return Object.assign({}, state, {
        profiles: profiles.content,
        totalPages: profiles.totalPages,
        totalElements: profiles.totalElements,
        size: profiles.size,
        currentPage: profiles.number,
        numberOfElements: profiles.numberOfElements,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromProfileList.LOAD_PROFILES_FAILURE:
      return Object.assign({}, state, {
        profiles: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting profiles'
      });
    default:
      return state;
  }
};
