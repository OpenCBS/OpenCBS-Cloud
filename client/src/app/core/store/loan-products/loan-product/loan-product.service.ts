import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanProductService {

  constructor(
    private httpClient: HttpClient) {
  }

  getLoanProduct(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}loan-products/${id}`).pipe(
      delay(environment.RESPONSE_DELAY));
  }
}
