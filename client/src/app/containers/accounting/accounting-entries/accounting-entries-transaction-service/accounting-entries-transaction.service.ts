import { of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AccountingEntriesTransactionService {

  constructor(private httpClient: HttpClient) {
  }

  addSingleTransaction(data) {
    const url = `${environment.API_ENDPOINT}accounting/entry`;

    return this.httpClient.post<any>(url, JSON.stringify(data)).pipe(delay(environment.RESPONSE_DELAY),
      catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
  }

  addMultipleTransaction(data) {
    const url = `${environment.API_ENDPOINT}accounting/multiple`;

    return this.httpClient.post<any>(url, JSON.stringify(data)).pipe(delay(environment.RESPONSE_DELAY),
      catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
  }
}
