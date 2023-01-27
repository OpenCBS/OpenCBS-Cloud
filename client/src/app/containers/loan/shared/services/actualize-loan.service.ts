import { of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ActualizeLoanService {

  constructor(private httpClient: HttpClient) {
  }

  actualizeLoan(loanId, date) {
    return this.httpClient.post<any>(`${environment.API_ENDPOINT}loans/actualize/${loanId}?date=${date}`,
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
