import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BorrowingService {

  constructor(private httpClient: HttpClient) {
  }

  getBorrowing(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}borrowings/${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  disburseBorrowing(borrowingId) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}borrowings/${borrowingId}/disburse`,
      null)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
