import * as fromBranchFields from './branch-fields.actions';

export interface BranchFieldsState {
  branchFields: any[];
  loading: boolean;
  loaded: boolean;
  type: string;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialBranchFieldsState = {
  branchFields: [],
  loading: false,
  loaded: false,
  type: '',
  success: false,
  error: false,
  errorMessage: ''
};

export function branchFieldsReducer(state = initialBranchFieldsState,
                                    action: fromBranchFields.BranchFieldsAction) {
  switch (action.type) {
    case fromBranchFields.LOADING_BRANCH_FIELDS_META:
      return Object.assign({}, state, {
        loading: true
      });
    case fromBranchFields.LOAD_BRANCH_FIELDS_META_SUCCESS:
      return Object.assign({}, state, {
        branchFields: action.payload,
        loading: false,
        loaded: true,
        type: action.payload.type,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromBranchFields.LOAD_BRANCH_FIELDS_META_FAILURE:
      return Object.assign({}, state, {
        branchFields: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting branch field'
      });
    case fromBranchFields.RESET_BRANCH_FIELDS_META:
      return initialBranchFieldsState;
    default:
      return state;
  }
};
