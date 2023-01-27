import { of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SavingService {

  constructor(private httpClient: HttpClient) {
  }

  getSaving(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}savings/${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  openSaving(id, data) {
    return this.httpClient.post<any>(
      `${environment.API_ENDPOINT}savings/${id}/open?initialAmount=${data}`,
      null).pipe(delay(environment.RESPONSE_DELAY),
      catchError(err => {
        const errObj = {
          error: true,
          message: err.error.message ? err.error.message : 'Error open saving'
        };
        return observableOf(errObj);
      }));
  }

  lockSaving(id) {
    return this.httpClient.post<any>(
      `${environment.API_ENDPOINT}savings/${id}/lock`,
      null).pipe(delay(environment.RESPONSE_DELAY),
      catchError(err => {
        const errObj = {
          error: true,
          message: err.error.message ? err.error.message : 'Error lock saving'
        };
        return observableOf(errObj);
      }));
  }

  closeSaving(id, date) {
    return this.httpClient.post<any>(
      `${environment.API_ENDPOINT}savings/${id}/close?closeDate=${date}`,
      null).pipe(delay(environment.RESPONSE_DELAY),
      catchError(err => {
        const errObj = {
          error: true,
          message: err.error.message ? err.error.message : 'Error close saving'
        };
        return observableOf(errObj);
      }));
  }

  depositSaving(id, operationAmount, operationDate) {
    operationDate = operationDate + moment().format(environment.TIME_FORMAT);
    return this.httpClient.post<any>(
      `${environment.API_ENDPOINT}savings/${id}/deposit?amount=${operationAmount}&date=${operationDate}`,
      null).pipe(delay(environment.RESPONSE_DELAY),
      catchError(err => {
        const errObj = {
          error: true,
          message: err.error.message ? err.error.message : 'Error deposit saving'
        };
        return observableOf(errObj);
      }));
  }

  withdrawSaving(id, operationAmount, operationDate) {
    operationDate = operationDate + moment().format(environment.TIME_FORMAT);
    return this.httpClient.post<any>(
      `${environment.API_ENDPOINT}savings/${id}/withdraw?amount=${operationAmount}&date=${operationDate}`,
      null).pipe(delay(environment.RESPONSE_DELAY),
      catchError(err => {
        const errObj = {
          error: true,
          message: err.error.message ? err.error.message : 'Error withdraw saving'
        };
        return observableOf(errObj);
      }));
  }
}
