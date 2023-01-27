import * as fromPenalties from './penalties.actions';

export interface Penalty {
  id: number;
  name: string;
  beginPeriodDay: number;
  endPeriodDay: number;
  penaltyType: string;
  penalty: number;
  gracePeriod: number;
  bigDecimal: number;
  accrualAccountId: string;
  incomeAccountId: string;
}

export interface PenaltiesState {
  penalties: Penalty[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
  numberOfElements: number;
}

const initialPenaltiesState: PenaltiesState = {
  penalties: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: '',
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  size: 0,
  numberOfElements: 0
};

export function penaltiesReducer(state = initialPenaltiesState,
                                   action: fromPenalties.PenaltiesActions) {
  switch (action.type) {
    case fromPenalties.LOADING_PENALTIES:
      return Object.assign({}, state, {
        loading: true
      });
    case fromPenalties.LOAD_PENALTIES_SUCCESS:
      const penalties = action.payload;
      return Object.assign({}, state, {
        penalties: penalties.content,
        totalPages: penalties.totalPages,
        totalElements: penalties.totalElements,
        size: penalties.size,
        currentPage: penalties.number,
        numberOfElements: penalties.numberOfElements,
        loaded: true,
        loading: false,
        success: true
      });
    case fromPenalties.LOAD_PENALTIES_FAILURE:
      return Object.assign({}, state, {
        penalties: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting penalties'
      });
    case fromPenalties.PENALTIES_RESET:
      return initialPenaltiesState;
    default:
      return state;
  }
}
