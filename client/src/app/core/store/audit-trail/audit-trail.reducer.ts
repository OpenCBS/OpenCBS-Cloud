import * as fromAuditTrailActions from './audit-trail.actions'

export interface IAuditTrailObjects {
  auditTrailObjects: any[];
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

const initialState: IAuditTrailObjects = {
  auditTrailObjects: [],
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

export function auditTrailReducer(state = initialState, action: fromAuditTrailActions.AuditTrailActions) {
  switch (action.type) {
    case fromAuditTrailActions.LOAD_AUDIT_TRAIL:
      return Object.assign({}, state, {
        loading: true
      });
    case fromAuditTrailActions.LOAD_AUDIT_TRAIL_SUCCESS:
      const auditTrailObjects = action.payload;
      return Object.assign({}, state, {
        auditTrailObjects: auditTrailObjects.content,
        totalPages: auditTrailObjects.totalPages,
        totalElements: auditTrailObjects.totalElements,
        currentPage: auditTrailObjects.number + 1,
        size: auditTrailObjects.size,
        numberOfElements: auditTrailObjects.numberOfElements,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromAuditTrailActions.LOAD_AUDIT_TRAIL_FAILURE:
      return Object.assign({}, state, {
        auditTrailObjects: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        size: 0,
        numberOfElements: 0,
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting audit trail data'
      });
    case fromAuditTrailActions.RESET_AUDIT_TRAIL:
      return initialState;
  }

  return state;
}
