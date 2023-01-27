import { Observable, of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class OtherFeesService {

  constructor(private httpClient: HttpClient) {
  }

  getOtherFees(loanId): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}other-fees/${loanId}/other-fees`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  dispatchOtherFee(data, feeId, loanId, type): Observable<any> {
    const url = `${environment.API_ENDPOINT}other-fees/${feeId}/${loanId}/${type}`;
    return this.httpClient.post(
      url,
      JSON.stringify(data))
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
