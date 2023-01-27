import { of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Injectable()
export class RepaymentImportingLoansService {

  constructor(private httpClient: HttpClient) {
  }

  repayImportingLoans(loans) {

    return this.httpClient.post(
      `${environment.API_ENDPOINT}sepa/integration/import/repay`,
      JSON.stringify(loans))
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const errObj = {
            error: true,
            message: err.error.message
          };
          return observableOf(errObj);
        }));
  }
}
