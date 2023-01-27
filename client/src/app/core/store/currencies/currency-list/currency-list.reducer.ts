import { ActionReducer, Action } from '@ngrx/store';
import * as fromCurrencyList from './currency-list.actions'

export interface ICurrencyList {
  currencies: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCurrencyListState: ICurrencyList = {
  currencies: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function currencyListReducer(state = initialCurrencyListState,
                                    action: fromCurrencyList.CurrencyListActions) {
  switch (action.type) {
    case fromCurrencyList.LOADING_CURRENCIES:
      return Object.assign({}, state, {
        loading: true
      });
    case fromCurrencyList.LOAD_CURRENCIES_SUCCESS:
      return Object.assign({}, state, {
        currencies: action.payload,
        loaded: true,
        success: true,
        loading: false,
        error: false,
        errorMessage: ''
      });
    case fromCurrencyList.LOAD_CURRENCIES_FAILURE:
      return Object.assign({}, state, {
        currencies: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting currency list'
      });
    case fromCurrencyList.RESET_CURRENCIES:
      return initialCurrencyListState;
    default:
      return state;
  }
};

