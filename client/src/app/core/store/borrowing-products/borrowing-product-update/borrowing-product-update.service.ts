import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BorrowingProductUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateBorrowingProduct(branch, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}borrowing-products/${id}`,
      JSON.stringify(branch))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
