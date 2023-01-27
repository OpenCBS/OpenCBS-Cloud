import { Observable, of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class CollateralTypeDetailsService {

  constructor(private httpClient: HttpClient) {
  }

  getCollateralTypeDetails(id: number): Observable<any> {
    const url = `types-of-collateral/${id}`;

    return this.httpClient.get(`${environment.API_ENDPOINT}${url}`)
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          if (err.error.status === 401) {
            return observableOf(err.error);
          }
          return err.error;
        }));
  }
}
