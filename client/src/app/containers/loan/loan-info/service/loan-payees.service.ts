import { Observable, of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanPayeeService {

  constructor(private httpClient: HttpClient) {
  }

  addPayee(loanAppId, payee): Observable<any> {
    const url = `${environment.API_ENDPOINT}loan-applications/${loanAppId}/payees?payeeId=${payee.payeeId}`;

    return this.httpClient.post<any>(url, JSON.stringify(payee), {observe: 'response'}).pipe(delay(environment.RESPONSE_DELAY),
      catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
  }

  deletePayee(loanAppId, loanAppPayeeId): Observable<any> {
    const url = `${environment.API_ENDPOINT}loan-applications/${loanAppId}/payees?loanApplicationPayeesId=${loanAppPayeeId}`;

    return this.httpClient.delete(url, {observe: 'response'})
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
