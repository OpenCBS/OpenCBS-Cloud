import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PaymentMethodCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createPaymentMethod(paymentMethod) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}payment-methods`,
      JSON.stringify(paymentMethod))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
