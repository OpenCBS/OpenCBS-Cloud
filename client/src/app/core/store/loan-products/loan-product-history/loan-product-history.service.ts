import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanProductHistoryService {

  constructor(private httpClient: HttpClient) {
  }

  getLoanProductHistory(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}loan-products/${id}/history`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
