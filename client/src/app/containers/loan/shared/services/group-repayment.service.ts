import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { of as observableOf } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class GroupRepaymentService {

  constructor(private httpClient: HttpClient) {
  }

  getLoanGroupSchedule(loanId: number, data: Object) {
    return this.httpClient.post<any>(
      `${environment.API_ENDPOINT}loans/group-repayment/${loanId}/schedules`,
      JSON.stringify(data))
      .pipe(catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
  }

  repay(data: any) {
    const url = `${environment.API_ENDPOINT}loans/group-repayment/repay`;
    return this.httpClient.post<any>(url, JSON.stringify(data))
      .pipe(catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
  }
}
