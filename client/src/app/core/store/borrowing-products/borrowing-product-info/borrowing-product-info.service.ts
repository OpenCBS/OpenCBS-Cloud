import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BorrowingProductInfoService {

  constructor(private httpClient: HttpClient) {
  }

  getBorrowingProductInfo(id): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}borrowing-products/${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
