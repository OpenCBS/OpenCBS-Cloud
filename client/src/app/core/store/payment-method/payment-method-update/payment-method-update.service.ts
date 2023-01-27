import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PaymentMethodUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updatePaymentMethod(paymentMethod, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}payment-methods/${id}`,
      JSON.stringify(paymentMethod))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
