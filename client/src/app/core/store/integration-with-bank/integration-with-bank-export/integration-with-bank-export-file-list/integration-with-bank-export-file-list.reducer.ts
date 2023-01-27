import * as fromIntegrationWithBankExportFileListActions from './integration-with-bank-export-file-list.actions'

export interface IIntegrationWithBankExportFileList {
  integrationWithBankExportFileList: any[];
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

const initialState: IIntegrationWithBankExportFileList = {
  integrationWithBankExportFileList: [],
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

export function integrationWithBankExportFileListReducer(
  state = initialState, action: fromIntegrationWithBankExportFileListActions.IntegrationWithBankExportFileListActions) {
  switch (action.type) {
    case fromIntegrationWithBankExportFileListActions.LOAD_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST:
      return Object.assign({}, state, {
        loading: true
      });
    case fromIntegrationWithBankExportFileListActions.LOAD_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST_SUCCESS:
      const integrationWithBankExportFileList = action.payload;
      return Object.assign({}, state, {
        integrationWithBankExportFileList: integrationWithBankExportFileList.content,
        totalPages: integrationWithBankExportFileList.totalPages,
        totalElements: integrationWithBankExportFileList.totalElements,
        currentPage: integrationWithBankExportFileList.number + 1,
        size: integrationWithBankExportFileList.size,
        numberOfElements: integrationWithBankExportFileList.numberOfElements,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromIntegrationWithBankExportFileListActions.LOAD_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST_FAILURE:
      return Object.assign({}, state, {
        integrationWithBankExportFileList: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting integration with bank export file list'
      });
    case fromIntegrationWithBankExportFileListActions.RESET_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST:
      return initialState;
  }

  return state;
}
