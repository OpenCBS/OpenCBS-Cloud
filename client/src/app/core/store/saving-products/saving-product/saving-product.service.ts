import { delay } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SavingProductService {

  constructor(private httpClient: HttpClient) {
  }

  getSavingProduct(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}saving-products/${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
