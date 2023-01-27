import { of as observableOf } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ActualizeTermDepositService {
  constructor(private httpClient: HttpClient) {
  }

  actualizeTermDeposit(TermDepositId, date) {
    return this.httpClient.post<any>(`${environment.API_ENDPOINT}term-deposits/actualize/${TermDepositId}?date=${date}`,
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
