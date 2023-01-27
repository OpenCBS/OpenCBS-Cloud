import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';

import { of as observableOf } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class CreditLineUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateCreditLine(creditLine, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}credit-lines/${id}`,
      JSON.stringify(creditLine))
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
