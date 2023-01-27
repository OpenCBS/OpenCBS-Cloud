import { ReduxBaseActions } from './redux.base.actions';
import { NgRxAction } from '../action.interface';

export interface IReduxBase {
  data: any;
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


const InitialReduxBaseState: IReduxBase = {
  data: [],
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

export class ReduxBaseReducer {
  public static getConfig(baseActions: ReduxBaseActions, state: IReduxBase = InitialReduxBaseState, action: NgRxAction) {
    switch (action.type) {
      case baseActions.getLoadingActionName():
        return Object.assign({}, state, {
          loading: true
        });
      case baseActions.getSuccessActionName():
        return Object.assign({}, state, {
          data: action.payload,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          size: action.payload.size,
          currentPage: action.payload.number,
          numberOfElements: action.payload.numberOfElements,
          loading: false,
          loaded: true,
          success: true,
          error: false,
          errorMessage: ''
        });
      case baseActions.getFailureActionName():
        return Object.assign({}, state, {
          data: [],
          loading: false,
          loaded: true,
          success: false,
          error: true,
          errorMessage: action.payload.err.message || `Error working with data: ${baseActions.getClassName()}`
        });
      case baseActions.getResetActionName():
        return InitialReduxBaseState;
    }
    return state;
  }
}
