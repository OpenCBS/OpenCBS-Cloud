import { of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { IntegrationWithBankExportService } from './integration-with-bank-export.service';
import * as integrationWithBankExportActions from './integration-with-bank-export.actions'


@Injectable()
export class IntegrationWithBankExportEffects {
  @Effect()
  get_integration_with_bank_export$ = this.actions$
    .pipe(ofType(integrationWithBankExportActions.LOAD_INTEGRATION_WITH_BANK_EXPORT),
      switchMap((action: integrationWithBankExportActions.IntegrationWithBankExportActions) => {
        return this.integrationWithBankExportService.getIntegrationWithBankExport(action.payload.params).pipe(
          map(res => {
            return new integrationWithBankExportActions.LoadIntegrationWithBankExportSuccess(res.data);
          }),
          catchError(err => {
            const errObj = new integrationWithBankExportActions.LoadIntegrationWithBankExportFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private integrationWithBankExportService: IntegrationWithBankExportService,
              private actions$: Actions) {
  }
}
