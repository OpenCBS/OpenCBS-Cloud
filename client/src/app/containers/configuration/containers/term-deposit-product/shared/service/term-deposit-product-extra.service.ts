import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TermDepositProductExtraService {
  constructor(private httpClient: HttpClient) {
  }

  getTermDepositProductAccounts() {
    return this.httpClient.get(`${environment.API_ENDPOINT}term-deposit-products/account-rules`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
