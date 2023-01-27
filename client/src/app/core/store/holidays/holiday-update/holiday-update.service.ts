import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HolidayUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateHoliday(holiday, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}holidays/${id}`,
      JSON.stringify(holiday))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
