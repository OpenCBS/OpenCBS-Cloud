import { Action } from '@ngrx/store';

export const LOAD_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST =
  '[INTEGRATION_WITH_BANK_IMPORT_FILE_LIST] LOAD_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST';
export const LOAD_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST_SUCCESS =
  '[INTEGRATION_WITH_BANK_IMPORT_FILE_LIST] LOAD_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST_SUCCESS';
export const LOAD_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST_FAILURE =
  '[INTEGRATION_WITH_BANK_IMPORT_FILE_LIST] LOAD_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST_FAILURE';
export const RESET_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST =
  '[INTEGRATION_WITH_BANK_IMPORT_FILE_LIST] RESET_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST';

export class LoadIntegrationWithBankImportFileList implements Action {
  readonly type = LOAD_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST;

  constructor(public payload?: any) {
  }
}

export class LoadIntegrationWithBankImportFileListSuccess implements Action {
  readonly type = LOAD_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadIntegrationWithBankImportFileListFailure implements Action {
  readonly type = LOAD_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetIntegrationWithBankImportFileList implements Action {
  readonly type = RESET_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST;

  constructor(public payload?: any) {
  }
}

export type IntegrationWithBankImportFileListActions =
  LoadIntegrationWithBankImportFileList
  | LoadIntegrationWithBankImportFileListSuccess
  | LoadIntegrationWithBankImportFileListFailure
  | ResetIntegrationWithBankImportFileList;

