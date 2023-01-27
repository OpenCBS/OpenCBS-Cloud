import { ActionReducer } from '@ngrx/store';
import * as fromRelationships from './relationship-list.actions';

export interface IRelationshipList {
  relationships: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialRelationshipState: IRelationshipList = {
  relationships: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function relationshipListReducer(state = initialRelationshipState,
                                        action: fromRelationships.RelationshipListActions) {
  switch (action.type) {
    case fromRelationships.LOADING_RELATIONSHIPS:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromRelationships.LOAD_RELATIONSHIPS_SUCCESS:
      return Object.assign({}, state, {
        relationships: action.payload,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromRelationships.LOAD_RELATIONSHIPS_FAILURE:
      return Object.assign({}, state, {
        loan_applications: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting relationship list'
      });
    default:
      return state;
  }
};
