import { of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { IntegrationWithBankExportFileListService } from './integration-with-bank-export-file-list.service';
import * as integrationWithBankExportFileListActions from './integration-with-bank-export-file-list.actions'


@Injectable()
export class IntegrationWithBankExportFileListEffects {
  @Effect()
  get_integration_with_bank_import_file_list$ = this.actions$
    .pipe(ofType(integrationWithBankExportFileListActions.LOAD_INTEGRATION_WITH_BANK_EXPORT_FILE_LIST),
      switchMap((action: integrationWithBankExportFileListActions.IntegrationWithBankExportFileListActions) => {
        return this.integrationWithBankExportFileListService.getIntegrationWithBankExportFileList(action.payload.params).pipe(
          map(res => {
            return new integrationWithBankExportFileListActions.LoadIntegrationWithBankExportFileListSuccess(res);
          }),
          catchError(err => {
            const errObj = new integrationWithBankExportFileListActions.LoadIntegrationWithBankExportFileListFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private integrationWithBankExportFileListService: IntegrationWithBankExportFileListService,
              private actions$: Actions) {
  }
}
