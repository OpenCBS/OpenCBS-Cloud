import { ILoanAppFormData, ILoanAppFormState, ILoanProduct } from './loan-application-form.interfaces';
import * as fromLoanAppForm from './loan-application-form.actions';
import { ICreditLine } from '../../credit-line';

const initialFormState: ILoanAppFormState = {
  changed: false,
  valid: false,
  data: <ILoanAppFormData>{},
  total: [],
  currentRoute: '',
  state: '',
  breadcrumb: [],
  loaded: false,
  creditLine: <ICreditLine>{},
  loanProduct: <ILoanProduct>{},
  payees: [],
  entryFees: [],
  profile: {},
  id: null,
  currencyName: '',
  members: []
};

export function loanAppFormReducer(state = initialFormState,
                                   action: fromLoanAppForm.LoanAppFormActions) {
  switch (action.type) {
    case fromLoanAppForm.LOAN_APP_POPULATE: {
      const { valid, data, total, loanProduct, payees, entryFees, members } = action.payload;
      return Object.assign({}, state, {
        changed: false,
        valid,
        data,
        total,
        loaded: true,
        creditLine: data.creditLine || state.creditLine,
        loanProduct: loanProduct || state.loanProduct,
        payees,
        entryFees,
        loanAppId: data.loanAppId,
        profile: data.profile || state.profile,
        currencyId: data.currencyId,
        scheduleType: data.scheduleType,
        members: members || [],
        currencyName: data.currencyName || (loanProduct && loanProduct.currency ? loanProduct.currency.name : ''),
      });
    }
    case fromLoanAppForm.LOAN_APP_SET_ROUTE:
      return Object.assign({}, state, {
        currentRoute: action.payload
      });
    case fromLoanAppForm.LOAN_APP_SET_STATE:
      return Object.assign({}, state, {
        state: action.payload.state
      });
    case fromLoanAppForm.LOAN_APP_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromLoanAppForm.LOAN_APP_FORM_RESET:
      return initialFormState;
    case fromLoanAppForm.LOAN_APP_SET_LOADED:
      return Object.assign({}, state, {
        loaded: true
      });
    case fromLoanAppForm.LOAN_APP_SET_VALIDITY:
      return Object.assign({}, state, {
        valid: action.payload.valid
      });
    case fromLoanAppForm.LOAN_APP_SET_LOAN_PRODUCT:
      return Object.assign({}, state, {
        loanProduct: action.payload.loanProduct
      });
    case fromLoanAppForm.LOAN_APP_SET_TOTAL:
      return Object.assign({}, state, {
        total: action.payload.total
      });
    case fromLoanAppForm.LOAN_APP_SET_PROFILE:
      return Object.assign({}, state, {
        profile: action.payload
      });
    default:
      return state;
  }
}
