import { Observable, of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AccountsService {

  constructor(private httpClient: HttpClient) {
  }

  getAccounts(): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}accounting/lookup`)
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          return observableOf(err.error)
        }));
  }
}
