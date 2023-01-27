import * as fromSaving from './saving-list.actions';

export interface ISavingList {
  saving: any[];
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

const initialSavingState: ISavingList = {
  saving: [],
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

export function savingListReducer(state = initialSavingState,
                                  action: fromSaving.SavingListActions) {
  switch (action.type) {
    case fromSaving.LOAD_SAVINGS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromSaving.LOAD_SAVINGS_SUCCESS:
      const saving = action.payload;
      return Object.assign({}, state, {
        saving: saving.content,
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
    case fromSaving.LOAD_SAVINGS_FAILURE:
      return Object.assign({}, state, {
        saving: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting saving list'
      });
    default:
      return state;
  }
};
