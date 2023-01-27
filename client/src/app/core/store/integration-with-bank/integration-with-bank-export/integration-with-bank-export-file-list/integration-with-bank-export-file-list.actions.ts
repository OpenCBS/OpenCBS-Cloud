import { Action } from '@ngrx/store';

export const LOAD_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST =
  '[INTEGRATION_WITH_BANK_EXPORT_FILE_LIST] LOAD_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST';
export const LOAD_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST_SUCCESS =
  '[INTEGRATION_WITH_BANK_EXPORT_FILE_LIST] LOAD_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST_SUCCESS';
export const LOAD_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST_FAILURE =
  '[INTEGRATION_WITH_BANK_EXPORT_FILE_LIST] LOAD_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST_FAILURE';
export const RESET_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST =
  '[INTEGRATION_WITH_BANK_EXPORT_FILE_LIST] RESET_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST';

export class LoadIntegrationWithBankExportFileList implements Action {
  readonly type = LOAD_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST;

  constructor(public payload?: any) {
  }
}

export class LoadIntegrationWithBankExportFileListSuccess implements Action {
  readonly type = LOAD_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadIntegrationWithBankExportFileListFailure implements Action {
  readonly type = LOAD_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetIntegrationWithBankExportFileList implements Action {
  readonly type = RESET_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST;

  constructor(public payload?: any) {
  }
}

export type IntegrationWithBankExportFileListActions =
  LoadIntegrationWithBankExportFileList
  | LoadIntegrationWithBankExportFileListSuccess
  | LoadIntegrationWithBankExportFileListFailure
  | ResetIntegrationWithBankExportFileList;

