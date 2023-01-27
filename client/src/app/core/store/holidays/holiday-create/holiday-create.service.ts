import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HolidayCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createHoliday(holiday) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}holidays`,
      JSON.stringify(holiday))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
