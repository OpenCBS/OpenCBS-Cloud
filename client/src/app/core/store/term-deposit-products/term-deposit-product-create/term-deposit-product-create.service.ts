import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { of as observableOf } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TermDepositProductCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createTermDepositProduct(loanProduct) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}term-deposit-products`,
      JSON.stringify(loanProduct))
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
