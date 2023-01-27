import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BorrowingProductCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createBorrowingProduct(loanProduct) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}borrowing-products`,
      JSON.stringify(loanProduct)).pipe(delay(environment.RESPONSE_DELAY));
  }
}
