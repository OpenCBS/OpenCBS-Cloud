import { Observable, of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class CurrentAccountTransactionsService {

  constructor(private httpClient: HttpClient) {
  }

  getCurrentAccountTransactions(params): Observable<any> {
    let url: string;
    const queryParams = `?from=${params.period.start}&to=${params.period.end}&size=20`;
    const endPoint = `${environment.API_ENDPOINT}accounting/accounts/${params.id}/operations${queryParams}`;
    url = params.query ? `${endPoint}&page=${params.query.page-1}` : endPoint;
    return this.httpClient.get(url).pipe(delay(environment.RESPONSE_DELAY));
  }

  makeTransaction(curAccountId, type, data): Observable<any> {
    const transferType = type !== 'deposit' ? 'transfer-to' : 'transfer-from';
    const url = `${environment.API_ENDPOINT}accounting/accounts/${curAccountId}/${transferType}`;

    return this.httpClient.post(
      `${url}`,
      data).pipe(delay(environment.RESPONSE_DELAY),
      catchError((err: HttpErrorResponse) => {
        return observableOf(err.error);
      }));

  }
}
