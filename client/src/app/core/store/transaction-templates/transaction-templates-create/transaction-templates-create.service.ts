import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TransactionTemplatesCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createTransactionTemplates(transactionTemplates) {

    return this.httpClient.post(
      `${environment.API_ENDPOINT}transaction-templates`,
      JSON.stringify(transactionTemplates))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
