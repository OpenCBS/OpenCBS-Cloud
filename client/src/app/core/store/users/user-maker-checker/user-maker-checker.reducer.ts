import { Role } from '../../roles';
import * as fromUserMakerChecker from './user-maker-checker.actions';

export interface UserMakerCheckerState {
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
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUserMakerCheckerState: UserMakerCheckerState = {
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
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function userMakerCheckerReducer(state = initialUserMakerCheckerState, action: fromUserMakerChecker.UserMakerCheckerActions) {
  switch (action.type) {
    case fromUserMakerChecker.LOADING_USER_MAKER_CHECKER:
      return Object.assign({}, state, {
        loading: true
      });
    case fromUserMakerChecker.LOAD_USER_MAKER_CHECKER_SUCCESS:
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
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromUserMakerChecker.USER_MAKER_CHECKER_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromUserMakerChecker.LOAD_USER_MAKER_CHECKER_FAILURE:
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
        loading: false,
        loaded: false,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting user maker/checker'
      });
    case fromUserMakerChecker.RESET_USER_MAKER_CHECKER:
      return initialUserMakerCheckerState;
    default:
      return state;
  }
}
