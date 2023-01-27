import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { of as observableOf } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TransactionTemplatesUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateTransactionTemplates(transactionTemplates, id) {

    return this.httpClient.put(
      `${environment.API_ENDPOINT}transaction-templates/${id}`,
      JSON.stringify(transactionTemplates))
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
