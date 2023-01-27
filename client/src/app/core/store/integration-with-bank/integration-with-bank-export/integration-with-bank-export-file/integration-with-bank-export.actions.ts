import { Action } from '@ngrx/store';

export const LOAD_INTEGRATION_WITH_BANK_EXPORT = '[INTEGRATION_WITH_BANK_EXPORT] LOAD_INTEGRATION_WITH_BANK_EXPORT';
export const LOAD_INTEGRATION_WITH_BANK_EXPORT_SUCCESS = '[INTEGRATION_WITH_BANK_EXPORT] LOAD_INTEGRATION_WITH_BANK_EXPORT_SUCCESS';
export const LOAD_INTEGRATION_WITH_BANK_EXPORT_FAILURE = '[INTEGRATION_WITH_BANK_EXPORT] LOAD_INTEGRATION_WITH_BANK_EXPORT_FAILURE';
export const RESET_INTEGRATION_WITH_BANK_EXPORT = '[INTEGRATION_WITH_BANK_EXPORT] RESET_INTEGRATION_WITH_BANK_EXPORT';

export class LoadIntegrationWithBankExport implements Action {
  readonly type = LOAD_INTEGRATION_WITH_BANK_EXPORT;

  constructor(public payload?: any) {
  }
}

export class LoadIntegrationWithBankExportSuccess implements Action {
  readonly type = LOAD_INTEGRATION_WITH_BANK_EXPORT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadIntegrationWithBankExportFailure implements Action {
  readonly type = LOAD_INTEGRATION_WITH_BANK_EXPORT_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetIntegrationWithBankExport implements Action {
  readonly type = RESET_INTEGRATION_WITH_BANK_EXPORT;

  constructor(public payload?: any) {
  }
}

export type IntegrationWithBankExportActions =
  LoadIntegrationWithBankExport
  | LoadIntegrationWithBankExportSuccess
  | LoadIntegrationWithBankExportFailure
  | ResetIntegrationWithBankExport;

