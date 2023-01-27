import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';


@Injectable()
export class BondScheduleService {

  constructor(private httpClient: HttpClient) {
  }

  getBondSchedule(data) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}bonds/preview`, data)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getActiveBondSchedule(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}bonds/${id}/schedule`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
