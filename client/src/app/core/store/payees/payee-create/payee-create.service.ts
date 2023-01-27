import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PayeeCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createPayee(payee) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}payees`,
      JSON.stringify(payee)).pipe(delay(environment.RESPONSE_DELAY));
  }
}
