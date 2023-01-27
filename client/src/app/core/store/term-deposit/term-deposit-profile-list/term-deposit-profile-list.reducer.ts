import * as fromTermDepositProfile from './term-deposit-profile-list.actions';

export interface ITermDepositProfileList {
  termDepositProfile: any[];
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

const initialTermDepositProfileState: ITermDepositProfileList = {
  termDepositProfile: [],
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

export function termDepositProfileListReducer(state = initialTermDepositProfileState,
                                              action: fromTermDepositProfile.TermDepositProfileListActions) {
  switch (action.type) {
    case fromTermDepositProfile.LOADING_TERM_DEPOSITS_PROFILE:
      return Object.assign({}, state, {
        loading: true
      });
    case fromTermDepositProfile.LOAD_TERM_DEPOSITS_PROFILE_SUCCESS:
      const termDeposit = action.payload;
      return Object.assign({}, state, {
        termDepositProfile: termDeposit.content,
        totalPages: termDeposit.totalPages,
        totalElements: termDeposit.totalElements,
        size: termDeposit.size,
        currentPage: termDeposit.number,
        numberOfElements: termDeposit.numberOfElements,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTermDepositProfile.LOAD_TERM_DEPOSITS_PROFILE_FAILURE:
      return Object.assign({}, state, {
        termDepositProfile: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting term deposit profile list'
      });
    default:
      return state;
  }
}
