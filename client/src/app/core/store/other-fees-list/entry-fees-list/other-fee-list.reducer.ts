import * as fromOtherFeeList from './other-fee-list.actions';

export interface OtherFeeList {
  id: number;
  name: string;
  minValue: number;
  maxValue: number;
  upperLimit: number;
  percentage: boolean;
}

export interface OtherFeeListState {
  otherFees: OtherFeeList[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialOtherFeeListState: OtherFeeListState = {
  otherFees: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function otherFeeListReducer(state = initialOtherFeeListState,
                                    action: fromOtherFeeList.OtherFeeListActions) {
  switch (action.type) {
    case fromOtherFeeList.LOADING_OTHER_FEES_LIST:
      return Object.assign({}, state, {
        loading: true
      });
    case fromOtherFeeList.LOAD_OTHER_FEES_LIST_SUCCESS:
      const otherFeesList = action.payload;
      return Object.assign({}, state, {
        otherFees: otherFeesList,
        loaded: true,
        loading: false,
        success: true
      });
    case fromOtherFeeList.LOAD_OTHER_FEES_LIST_FAILURE:
      return Object.assign({}, state, {
        otherFees: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting other fees list'
      });
    case fromOtherFeeList.OTHER_FEE_LIST_RESET:
      return initialOtherFeeListState;
    default:
      return state;
  }
};
