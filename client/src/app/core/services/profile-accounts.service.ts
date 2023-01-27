import { Observable, of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class AccountBalanceService {
  constructor(private httpClient: HttpClient) {
  }

  getProfileAccounts(type, id): Observable<any> {
    let url = '';
    if ( type === 'PERSON' ) {
      url = `${environment.API_ENDPOINT}profiles/people/${id}/accounts`
    } else if ( type === 'COMPANY' ) {
      url = `${environment.API_ENDPOINT}profiles/companies/${id}/accounts`
    }
    return this.httpClient.get(
      url).pipe(
      delay(environment.RESPONSE_DELAY),
      catchError(err => {
        return observableOf(err.error)
      }));
  }
}
