import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanAppScheduleService {

  constructor(
    private httpClient: HttpClient) {
  }

  getLoanAppSchedule(data) {
    const url = data.id ? `loan-applications/${data.id}/preview` : `loan-applications/preview`;
    return this.httpClient.post(
      `${environment.API_ENDPOINT}${url}`,
      data.form)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  validateLoanAppSchedule(data) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}loan-applications/${data.id}/schedule-update-validate`,
      data.installment)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  updateLoanAppSchedule(data) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}loan-applications/${data.id}/schedule-update`,
      data.installment)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
