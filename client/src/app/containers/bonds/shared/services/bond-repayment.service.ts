
import {of as observableOf,  Observable, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class BondRepaymentService {
  private repaymentActiveSource = new ReplaySubject<boolean>(1);

  constructor(private httpClient: HttpClient,
              private toastrService: ToastrService) {
  }

  announceRepaymentActiveChange(bool: boolean) {
    this.repaymentActiveSource.next(bool);
  }

  getPaymentAmount(loanId: number, data: Object) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}bonds/${loanId}/repayment/split`,
      JSON.stringify(data))
      .pipe(catchError(err => {
        this.toastrService.error(err.error.message, '', environment.ERROR_TOAST_CONFIG);
        return observableOf(err.error);
      }));
  }

  public repay(id: number, data) {
    const url = `${environment.API_ENDPOINT}bonds/${id}/repayment/repay`;
    return this.httpClient.post(url,
      JSON.stringify(data))
      .pipe(catchError(err => {
        this.toastrService.error(err.error.message, '', environment.ERROR_TOAST_CONFIG);
        return observableOf(err.error);
      }));
  }

  public preview(loanId: number, data: any): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}bonds/${loanId}/repayment/preview`,
      JSON.stringify(data))
      .pipe(catchError(err => {
        this.toastrService.error(err.error.message, '', environment.ERROR_TOAST_CONFIG);
        return observableOf(err.error);
      }));
  }
}
