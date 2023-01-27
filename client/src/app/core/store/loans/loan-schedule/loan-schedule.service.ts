import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class LoanScheduleService {

  constructor(private httpClient: HttpClient,
              private toastrService: ToastrService) {
  }

  getLoanSchedule(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}loans/${id}/schedule`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  validateLoanSchedule(data) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}loans/${data.id}/reschedule/validate`,
      data)
      .pipe(catchError(err => {
        this.toastrService.error(err.error.message, '', environment.ERROR_TOAST_CONFIG);
        return Observable.of(err.error);
      }));
  }

  updateLoanSchedule(data) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}loans/${data.id}/schedule-update`,
      data.installment)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
