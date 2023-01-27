import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BorrowingUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateBorrowing(borrowing, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}borrowings/${id}`,
      JSON.stringify(borrowing))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
