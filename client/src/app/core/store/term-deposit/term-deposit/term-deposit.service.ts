import { of as observableOf } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import * as moment from 'moment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TermDepositService {

  constructor(private httpClient: HttpClient) {
  }

  getTermDeposit(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}term-deposits/${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  openTermDeposit(id, data, openDate) {
    openDate = openDate + moment().format(environment.TIME_FORMAT);
    return this.httpClient.post<any>(
      `${environment.API_ENDPOINT}term-deposits/${id}/open?initialAmount=${data}&openDate=${openDate}`, null)
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const errObj = {
            error: true,
            message: err.error.message ? err.error.message : 'Error open term deposit'
          };
          return observableOf(errObj);
        }));
  }

  lockAndUnlockTermDeposit(id) {
    return this.httpClient.post<any>(
      `${environment.API_ENDPOINT}term-deposits/${id}/lock-unlock`,
      null)
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const errObj = {
            error: true,
            message: err.error.message ? err.error.message : 'Error lock term deposit'
          };
          return observableOf(errObj);
        }));
  }

  closeTermDeposit(id, date) {
    return this.httpClient.post<any>(
      `${environment.API_ENDPOINT}term-deposits/${id}/close?closeDate=${date}`,
      null)
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const errObj = {
            error: true,
            message: err.error.message ? err.error.message : 'Error close term deposit'
          };
          return observableOf(errObj);
        })
      );
  }
}
