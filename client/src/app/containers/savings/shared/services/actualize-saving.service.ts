import { of as observableOf } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ActualizeSavingService {
  constructor(private httpClient: HttpClient) {
  }

  actualizeSaving(SavingId, date) {
    return this.httpClient.post<any>(`${environment.API_ENDPOINT}savings/actualize/${SavingId}?date=${date}`,
      null,
      {responseType: 'text' as 'json'})
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const resp = JSON.parse(err.error);
          const errObj = {
            error: true,
            message: resp.message
          };
          return observableOf(errObj);
        }));
  }
}
