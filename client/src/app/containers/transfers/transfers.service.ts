import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of as observableOf } from 'rxjs/internal/observable/of';

@Injectable()
export class TransfersService {

  constructor(private httpClient: HttpClient) {
  }

  transferToVault(data): Observable<any> {
    const url = `${environment.API_ENDPOINT}transfers/from-bank-to-vault`;
    return this.httpClient.post(
      url,
      JSON.stringify(data)).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
  }

  transferToBank(data): Observable<any> {
    const url = `${environment.API_ENDPOINT}transfers/from-vault-to-bank`;
    return this.httpClient.post(
      url,
      JSON.stringify(data)).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
  }

  transferBetweenMembers(data): Observable<any> {
    const url = `${environment.API_ENDPOINT}transfers/between-members`;
    return this.httpClient.post(
      url,
      JSON.stringify(data)).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError((err: HttpErrorResponse) => {
        const errObj = {
          error: true,
          message: err.error.message
        };
        return observableOf(errObj);
      }));
  }

  getAccountBalance(accountId: number) {
    return this.httpClient.get<number>(
      `${environment.API_ENDPOINT}accounting/get-account-balance/${accountId}`)
  }
}
