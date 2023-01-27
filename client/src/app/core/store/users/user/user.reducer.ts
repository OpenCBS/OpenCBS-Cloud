import { Role } from '../../roles';
import * as fromUser from './user.actions';

export interface UserState {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  branch: {};
  role: Role;
  email: string;
  phoneNumber: string;
  address: string;
  idNumber: string;
  position: string;
  statusType: string;
  readOnly: boolean;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUserState: UserState = {
  id: -1,
  username: '',
  firstName: '',
  lastName: '',
  branch: {},
  role: null,
  email: '',
  phoneNumber: '',
  address: '',
  idNumber: '',
  position: '',
  statusType: '',
  readOnly: false,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function userReducer(state = initialUserState, action: fromUser.UserActions) {
  switch (action.type) {
    case fromUser.LOADING_USER:
      return Object.assign({}, state, {
        loading: true
      });
    case fromUser.LOAD_USER_SUCCESS:
      const user = action.payload;
      return Object.assign({}, state, {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        branch: user.branch,
        role: user.role,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        idNumber: user.idNumber,
        position: user.position,
        statusType: user.statusType,
        readOnly: user.readOnly,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromUser.USER_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromUser.LOAD_USER_FAILURE:
      return Object.assign({}, state, {
        id: -1,
        username: '',
        firstName: '',
        lastName: '',
        branch: {},
        role: null,
        email: '',
        phoneNumber: '',
        address: '',
        idNumber: '',
        position: '',
        statusType: '',
        readOnly: false,
        loading: false,
        loaded: false,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting user'
      });
    case fromUser.RESET_USER:
      return initialUserState;
    default:
      return state;
  }
}
