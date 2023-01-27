import * as fromOperationCreate from './operation-create.actions';

export interface ICreateOperation {
  till: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateOperationState: ICreateOperation = {
  till: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function operationCreateReducer(state = initialCreateOperationState,
                                       action: fromOperationCreate.OperationCreateActions) {
  switch (action.type) {
    case fromOperationCreate.CREATE_OPERATION_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromOperationCreate.CREATE_OPERATION_SUCCESS:
      return Object.assign({}, state, {
        till: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromOperationCreate.CREATE_OPERATION_FAILURE:
      return Object.assign({}, state, {
        till: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error teller new operation data'
      });
    case fromOperationCreate.CREATE_OPERATION_RESET:
      return initialCreateOperationState;
    default:
      return state;
  }
}
