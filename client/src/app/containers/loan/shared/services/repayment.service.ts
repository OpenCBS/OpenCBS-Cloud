import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RepaymentService {
  private repaymentActiveSource = new ReplaySubject<boolean>(1);
  repaymentActiveSourceChanged$ = this.repaymentActiveSource.asObservable();

  announceRepaymentActiveChange(bool: boolean) {
    this.repaymentActiveSource.next(bool);
  }

  constructor(private httpClient: HttpClient) {
  }

  getPaymentAmount(loanId: number, data: Object): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}loans/${loanId}/repayment/split`,
      JSON.stringify(data))
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const errObj = {
            error: true,
            message: err.error.message
          };
          return observableOf(errObj);
        }));
  }

  repay(loanId: number, data: any): Observable<any> {
    return this.httpClient.post(`${environment.API_ENDPOINT}loans/${loanId}/repayment/repay`,
      JSON.stringify(data))
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const errObj = {
            error: true,
            message: err.error.message
          };
          return observableOf(errObj);
        }));
  }

  preview(loanId: number, data: any): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}loans/${loanId}/repayment/preview`,
      JSON.stringify(data))
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const errObj = {
            error: true,
            message: err.error.message
          };
          return observableOf(errObj);
        }));
  }

  getRepaymentType(): Observable<any> {
    return this.httpClient.get(`${environment.API_ENDPOINT}repayment/types/lookup`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
