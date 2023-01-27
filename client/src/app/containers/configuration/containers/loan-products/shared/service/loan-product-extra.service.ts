import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanProductExtraService {
  constructor(private httpClient: HttpClient) {
  }

  getLoanProductAccounts() {
    return this.httpClient.get(`${environment.API_ENDPOINT}loan-products/account-rules`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
