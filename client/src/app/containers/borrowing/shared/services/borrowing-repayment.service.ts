import { of as observableOf, ReplaySubject } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class BorrowingRepaymentService {
  private repaymentActiveSource = new ReplaySubject<boolean>(1);

  constructor(private httpClient: HttpClient) {
  }

  announceRepaymentActiveChange(bool: boolean) {
    this.repaymentActiveSource.next(bool);
  }

  getPaymentAmount(loanId: number, data: Object) {
    return this.httpClient.post<any>(
      `${environment.API_ENDPOINT}borrowings/${loanId}/repayment/split`,
      JSON.stringify(data))
      .pipe(catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
  }

  repay(id: number, data) {
    const url = `${environment.API_ENDPOINT}borrowings/${id}/repayment/repay`;
    return this.httpClient.post<any>(url,
      JSON.stringify(data))
      .pipe(catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
  }

  preview(loanId: number, data: any) {
    return this.httpClient.post<any>(
      `${environment.API_ENDPOINT}borrowings/${loanId}/repayment/preview`,
      JSON.stringify(data))
      .pipe(catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
  }
}
