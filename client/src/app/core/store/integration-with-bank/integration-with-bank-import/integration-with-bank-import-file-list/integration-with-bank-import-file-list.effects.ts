import { of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { IntegrationWithBankImportFileListService } from './integration-with-bank-import-file-list.service';
import * as integrationWithBankImportFileListActions from './integration-with-bank-import-file-list.actions'


@Injectable()
export class IntegrationWithBankImportFileListEffects {
  @Effect()
  get_integration_with_bank_import_file_list$ = this.actions$
    .pipe(ofType(integrationWithBankImportFileListActions.LOAD_INTEGRATION_WITH_BANK_IMPORT_FILE_LIST),
      switchMap((action: integrationWithBankImportFileListActions.IntegrationWithBankImportFileListActions) => {
        return this.integrationWithBankImportFileListService.getIntegrationWithBankImportFileList(action.payload.params).pipe(
          map(res => {
            return new integrationWithBankImportFileListActions.LoadIntegrationWithBankImportFileListSuccess(res);
          }),
          catchError(err => {
            const errObj = new integrationWithBankImportFileListActions.LoadIntegrationWithBankImportFileListFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private integrationWithBankImportFileListService: IntegrationWithBankImportFileListService,
              private actions$: Actions) {
  }
}
