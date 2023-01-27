import { of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ReassignLoanService {

  constructor(private httpClient: HttpClient) {
  }

  reassignLoan(data) {
    return this.httpClient.post<any>(`${environment.API_ENDPOINT}loans/${data.loanId}/reassign-loan-officer/${data.userId}`,
      null,
      {responseType: 'text' as 'json'})
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const resp = JSON.parse(err.error);
          const errObj = {
            error: true,
            message: resp.message
          };
          return observableOf(errObj);
        }));
  }
}
