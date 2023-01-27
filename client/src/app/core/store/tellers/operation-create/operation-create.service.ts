import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

@Injectable()
export class OperationCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createDeposit(tillId, operation) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}tills/${tillId}/operations/deposit`,
      JSON.stringify(operation)).pipe(delay(environment.RESPONSE_DELAY),
      catchError(err => observableOf(err)));
  }

  createWithdraw(tillId, operation) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}tills/${tillId}/operations/withdraw`,
      JSON.stringify(operation))
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError(err => observableOf(err)));
  }

  createDepositSaving(tillId, operation) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}tills/${tillId}/operations/deposit-saving`,
      JSON.stringify(operation)).pipe(delay(environment.RESPONSE_DELAY),
      catchError(err => observableOf(err)));
  }

  createWithdrawSaving(tillId, operation) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}tills/${tillId}/operations/withdraw-saving`,
      JSON.stringify(operation)).pipe(delay(environment.RESPONSE_DELAY),
      catchError(err => observableOf(err)));
  }

  getProfile(profileId: number) {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}profiles/people/${profileId}`)
  }

  getWithdrawer(profileId: number) {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}profiles/${profileId}/single`)
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError(err => observableOf(err.error)));
  }

  getAccountBalance(accountId: number) {
    return this.httpClient.get<number>(
      `${environment.API_ENDPOINT}accounting/get-account-balance/${accountId}`)
  }
}
