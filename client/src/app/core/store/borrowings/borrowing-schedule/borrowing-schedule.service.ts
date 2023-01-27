import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class BorrowingScheduleService {

  constructor(private httpClient: HttpClient) {
  }

  getBorrowingSchedule(data) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}borrowings/preview`, data)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getActiveBorrowingSchedule(id) {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}borrowings/${id}/schedule`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
