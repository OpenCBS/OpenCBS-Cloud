import * as fromCurrentUser from './currentUser.actions';

export interface CurrentUserAppState {
  id: number,
  username: string,
  firstName: string,
  lastName: string,
  role: string,
  permissions: any[],
  branch: {},
  isAdmin: boolean;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialState: CurrentUserAppState = {
  id: -1,
  username: '',
  firstName: '',
  lastName: '',
  role: '',
  permissions: [],
  branch: '',
  isAdmin: false,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function currentUserReducer(state = initialState, action: fromCurrentUser.CurrentUserActions) {
  switch (action.type) {
    case fromCurrentUser.CURRENT_USER_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromCurrentUser.LOAD_CURRENT_USER_SUCCESS:
      const user = action.payload;
      return Object.assign({}, state, {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        permissions: user.role.permissions,
        branch: user.branch,
        isAdmin: user.isAdmin,
        loaded: true,
        success: true,
        error: false,
        errorMessage: '',
        loading: false
      });
    case fromCurrentUser.LOAD_CURRENT_USER_FAILURE:
      return Object.assign({}, state, {
        id: null,
        username: '',
        firstName: '',
        lastName: '',
        role: '',
        permissions: [],
        branch: null,
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting current User'
      });
    case fromCurrentUser.CURRENT_USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}
