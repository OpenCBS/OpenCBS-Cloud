import * as fromBond from './bond-list.actions';

export interface IBondList {
  bond: any[];
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

const initialBondState: IBondList = {
  bond: [],
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

export function bondListReducer(state = initialBondState,
                                action: fromBond.BondListActions) {
  switch (action.type) {
    case fromBond.LOADING_BONDS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromBond.LOAD_BONDS_SUCCESS:
      const bond = action.payload;
      return Object.assign({}, state, {
        bond: bond.content,
        totalPages: bond.totalPages,
        totalElements: bond.totalElements,
        size: bond.size,
        currentPage: bond.number,
        numberOfElements: bond.numberOfElements,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromBond.LOAD_BONDS_FAILURE:
      return Object.assign({}, state, {
        bond: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting bond list'
      });
    default:
      return state;
  }
};
