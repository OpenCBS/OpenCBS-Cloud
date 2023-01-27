import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TransactionTemplatesInfoService {

  constructor(private httpClient: HttpClient) {
  }

  getTransactionTemplates(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}transaction-templates/${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
