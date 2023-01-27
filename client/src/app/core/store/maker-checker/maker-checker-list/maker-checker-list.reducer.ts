import * as fromMakerCheckerList from './maker-checker-list.actions';


export interface IMakerCheckerList {
  makerCheckers: any[];
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

const initialMakerCheckerListState: IMakerCheckerList = {
  makerCheckers: [],
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


export function makerCheckerListReducer(state = initialMakerCheckerListState, action: fromMakerCheckerList.MakerCheckerListActions) {
  switch (action.type) {
    case fromMakerCheckerList.LOADING_MAKER_CHECKERS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromMakerCheckerList.LOAD_MAKER_CHECKERS_SUCCESS:
      const makerChecker = action.payload;
      return Object.assign({}, state, {
        makerCheckers: makerChecker.content,
        totalPages: makerChecker.totalPages,
        totalElements: makerChecker.totalElements,
        size: makerChecker.size,
        currentPage: makerChecker.number,
        numberOfElements: makerChecker.numberOfElements,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromMakerCheckerList.LOAD_MAKER_CHECKERS_FAILURE:
      return Object.assign({}, state, {
        makerCheckers: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting Maker/Checker'
      });
    default:
      return state;
  }
};
