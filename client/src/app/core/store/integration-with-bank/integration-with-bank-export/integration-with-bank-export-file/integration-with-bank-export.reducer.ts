import * as fromIntegrationWithBankExportActions from './integration-with-bank-export.actions'

export interface IIntegrationWithBankExport {
  integrationWithBankExport: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialState: IIntegrationWithBankExport = {
  integrationWithBankExport: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function integrationWithBankExportReducer(state = initialState,
                                                 action: fromIntegrationWithBankExportActions.IntegrationWithBankExportActions) {
  switch (action.type) {
    case fromIntegrationWithBankExportActions.LOAD_INTEGRATION_WITH_BANK_EXPORT:
      return Object.assign({}, state, {
        loading: true
      });
    case fromIntegrationWithBankExportActions.LOAD_INTEGRATION_WITH_BANK_EXPORT_SUCCESS:
      const integrationWithBankExport = action.payload;
      return Object.assign({}, state, {
        integrationWithBankExport: integrationWithBankExport,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromIntegrationWithBankExportActions.LOAD_INTEGRATION_WITH_BANK_EXPORT_FAILURE:
      return Object.assign({}, state, {
        integrationWithBankExport: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting integration with bank export data'
      });
    case fromIntegrationWithBankExportActions.RESET_INTEGRATION_WITH_BANK_EXPORT:
      return initialState;
  }

  return state;
}
