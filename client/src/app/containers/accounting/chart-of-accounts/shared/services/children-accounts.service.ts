import { Observable, of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ChildrenAccountsService {

  constructor(private httpClient: HttpClient) {
  }

  getAccounts(params): Observable<any> {
    const endPoint = `${environment.API_ENDPOINT}accounting/chart-of-accounts/root/${params.accountId}/leaves`;
    const url = !params.branchId ? endPoint : endPoint + `/branch?branch=${params.branchId}`;

    return this.httpClient.get(url).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError((err: HttpErrorResponse) => {
        return observableOf(err.error)
      }));
  }

  getChildrenByPage(accountId, page) {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}/accounting/chart-of-accounts/root/${accountId}/leaves?page=${page}`)
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError(err => {
          return observableOf(err.error)
        }));
  }
}
