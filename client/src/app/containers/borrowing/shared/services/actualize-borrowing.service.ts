import { of as observableOf } from 'rxjs';

import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ActualizeBorrowingService {
  constructor(private httpClient: HttpClient) {
  }


  actualizeBorrowing(borrowingId, date) {
    return this.httpClient.post<any>(`${environment.API_ENDPOINT}borrowings/actualize/${borrowingId}?date=${date}`,
      null)
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const errObj = {
            error: true,
            message: err.error.message
          };
          return observableOf(errObj);
        }));
  }
}
