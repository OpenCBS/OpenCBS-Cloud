import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PayeeUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updatePayee(payee, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}payees/${id}`,
      JSON.stringify(payee))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
