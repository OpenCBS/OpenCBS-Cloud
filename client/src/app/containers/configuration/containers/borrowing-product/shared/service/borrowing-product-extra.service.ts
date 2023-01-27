import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BorrowingProductExtraService {
  constructor(private httpClient: HttpClient) {
  }

  getBorrowingProductAccounts() {
    return this.httpClient.get(`${environment.API_ENDPOINT}borrowing-products/account-rules`).pipe(delay(environment.RESPONSE_DELAY));
  }
}
