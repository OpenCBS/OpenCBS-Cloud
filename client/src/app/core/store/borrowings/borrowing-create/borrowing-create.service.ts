import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BorrowingCreateService {

  constructor(private httpClient: HttpClient) {
  }

  addBorrowing(borrowing) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}borrowings`,
      JSON.stringify(borrowing))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
