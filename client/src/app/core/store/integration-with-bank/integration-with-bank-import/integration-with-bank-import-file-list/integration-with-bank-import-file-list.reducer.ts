import * as fromIntegrationWithBankImportFileListActions from './integration-with-bank-import-file-list.actions'

export interface IIntegrationWithBankImportFileList {
  integrationWithBankImportFileList: any[];
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

const initialState: IIntegrationWithBankImportFileList = {
  integrationWithBankImportFileList: [],
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

export function integrationWithBankImportFileListReducer(
  state = initialState, action: fromIntegrationWithBankImportFileListActions.IntegrationWithBankImportFileListActions) {
  switch (action.type) {
    case fromIntegrationWithBankImportFileListActions.LOAD_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST:
      return Object.assign({}, state, {
        loading: true
      });
    case fromIntegrationWithBankImportFileListActions.LOAD_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST_SUCCESS:
      const integrationWithBankImportFileList = action.payload;
      return Object.assign({}, state, {
        integrationWithBankImportFileList: integrationWithBankImportFileList.content,
        totalPages: integrationWithBankImportFileList.totalPages,
        totalElements: integrationWithBankImportFileList.totalElements,
        currentPage: integrationWithBankImportFileList.number + 1,
        size: integrationWithBankImportFileList.size,
        numberOfElements: integrationWithBankImportFileList.numberOfElements,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromIntegrationWithBankImportFileListActions.LOAD_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST_FAILURE:
      return Object.assign({}, state, {
        integrationWithBankImportFileList: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting integration with bank import file list'
      });
    case fromIntegrationWithBankImportFileListActions.RESET_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST:
      return initialState;
  }

  return state;
}
